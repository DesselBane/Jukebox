using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Players;
using Jukebox.Common.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Jukebox.Common.Players
{
    public class PlayerService : IPlayerService
    {
        private static int _idCounter = 0;
        private static readonly object ID_COUNTER_SYNC_HANDLE = new object();
        
        private readonly AuthenticationValidator _authValidator;
        private readonly DataContext _dataContext;
        private readonly IDictionary<int, (Player player, WebSocket socket)> _activePlayers = new ConcurrentDictionary<int, (Player player, WebSocket socket)>();
        private readonly WebsocketOptions _websocketOptions;


        public PlayerService(IOptions<WebsocketOptions> websocketOptions, AuthenticationValidator authValidator, DataContext dataContext)
        {
            _authValidator = authValidator;
            _dataContext = dataContext;
            _websocketOptions = websocketOptions.Value;
        }

        public Task<IEnumerable<Player>> GetAllPlayersAsync()
        {
            return Task.FromResult(_activePlayers.Values.Select(x => x.player).ToList() as IEnumerable<Player>);
        }

        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            if (_activePlayers.ContainsKey(playerId))
                return Task.FromResult(_activePlayers[playerId].player);
            throw new NotFoundException(playerId.ToString(), nameof(Player), Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND));
        }

        public async Task CreateSocketPlayerAsync(WebSocket socket)
        {
            var player = await InitializePlayer(socket);

            if (player == null)
                return;

            _activePlayers.Add(player.Id, (player, socket));

            await HandlePlayerOwnerWebsocket(player, socket);

            _activePlayers.Remove(player.Id);
        }

        public async Task AddSongToPlayerAsync(int playerId, int songId)
        {
            var player = _activePlayers[playerId].player;
            var song = await _dataContext.Songs.FirstOrDefaultAsync(x => x.Id == songId);
            
            player.Playlist.Add(song);
            NotifyClients(playerId);
        }

        private Task NotifyClients(int playerId)
        {
            //TODO
            if (_activePlayers.ContainsKey(playerId))
                return _activePlayers[playerId].socket.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(new
                                                                                                                                            {
                                                                                                                                                type = "update"
                                                                                                                                            }))), WebSocketMessageType.Text, true, CancellationToken.None);
            
            return Task.CompletedTask;
        }
        
        private async Task<Player> InitializePlayer(WebSocket socket)
        {
            var buffer = new byte[_websocketOptions.BufferSize];

            while (true)
            {
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.CloseStatus.HasValue)
                {
                    await socket.CloseAsync(result.CloseStatus.Value, socket.CloseStatusDescription, CancellationToken.None);
                    return null;
                }

                PlayerInitMessage msg;

                try
                {
                    msg = JsonConvert.DeserializeObject<PlayerInitMessage>(Encoding.ASCII.GetString(buffer), new JsonSerializerSettings
                                                                                                             {
                                                                                                                 MissingMemberHandling = MissingMemberHandling.Error
                                                                                                             });

                    //TODO find prettier solution
                    _authValidator.ValidateJwtToken(msg.AccessToken);
                }
                catch (JsonSerializationException)
                {
                    continue;
                }
                catch (InvalidRestOperationException ex) when (ex is UnauthorizedException || ex is NotFoundException)
                {
                    await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Unauthorized", CancellationToken.None);
                    return null;
                }

                Player player;
                
                lock (ID_COUNTER_SYNC_HANDLE)
                {
                    player = new Player
                           {
                               Name = msg.PlayerName,
                               Id = _idCounter++,
                               IsPlaying = false,
                               PlaylistIndex = 0
                           };
                }

                await socket.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(new
                                                                                                                  {
                                                                                                                      type = "init",
                                                                                                                      playerId = player.Id
                                                                                                                  }))), WebSocketMessageType.Text, true, CancellationToken.None);

                return player;
            }
        }

        private async Task HandlePlayerOwnerWebsocket(Player player, WebSocket socket)
        {
            var buffer = new byte[_websocketOptions.BufferSize];

            while (true)
            {
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.CloseStatus.HasValue)
                {
                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                    return;
                }

                HandlePlayerMessage(Encoding.ASCII.GetString(buffer));
            }
        }

        private static void HandlePlayerMessage(string message)
        {
            Console.WriteLine(message);
        }
    }
}