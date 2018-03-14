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
using Jukebox.Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.X9;


namespace Jukebox.Common.Players
{
    public class PlayerService : IPlayerService
    {
        private readonly DataContext      _dataContext;
        private readonly WebsocketOptions _websocketOptions;
        private readonly IDictionary<Guid,(Player player,WebSocket socket)> _activePlayers = new ConcurrentDictionary<Guid, (Player player, WebSocket socket)>();


        public PlayerService(DataContext dataContext, IOptions<WebsocketOptions> websocketOptions)
        {
            _dataContext      = dataContext;
            _websocketOptions = websocketOptions.Value;
        }

        public Task<IEnumerable<Player>> GetAllPlayersAsync() => Task.FromResult(_activePlayers.Values.Select(x => x.player).ToList() as IEnumerable<Player>);

        public Task<Player> GetPlayerByIdAsync(Guid playerId)
        {
            if (_activePlayers.ContainsKey(playerId))
                return Task.FromResult(_activePlayers[playerId].player);
            throw new NotFoundException(playerId.ToString(),nameof(Player),Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND));
        }

        public async Task CreateSocketPlayerAsync(WebSocket socket)
        {
            var player = await InitializePlayer(socket);
            
            if(player == null)
                return;
            
            _activePlayers.Add(player.Id,(player, socket));

            await HandlePlayerOwnerWebsocket(player, socket);

            _activePlayers.Remove(player.Id);
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

                var msg = JsonConvert.DeserializeObject<PlayerInitMessage>(Encoding.ASCII.GetString(buffer));

                Console.WriteLine("got Message");
                Console.WriteLine(Encoding.ASCII.GetString(buffer));
                
                if (msg != null)
                {
                    return new Player
                           {
                               Name = msg.PlayerName,
                               Id = Guid.NewGuid()
                           };
                }
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

        private void HandlePlayerMessage(string message)
        {
            Console.WriteLine(message);
        }
        
        /*public async Task CreateSocketPlayerAsyncOLD(WebSocket socket, Guid playerId)
        {
            var dbPlayer = await _dataContext.Players.FirstOrDefaultAsync(x => x.AccessGuid == playerId);
            dbPlayer.AccessGuid = null;
            await _dataContext.SaveChangesAsync();

            var cancelToken = new CancellationToken();
            var waitForCloseTask = CreateWaitForCloseTask(socket,cancelToken);

            //_activePlayers.Add(dbPlayer, (socket,waitForCloseTask,cancelToken, new object()));
            var data = Encoding.ASCII.GetBytes("Hello there web player");
            await socket.SendAsync(new ArraySegment<byte>(data, 0, data.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            
            await waitForCloseTask;

            _dataContext.Players.Remove(dbPlayer);
            await _dataContext.SaveChangesAsync();
        }

        private async Task CreateWaitForCloseTask(WebSocket socket, CancellationToken token)
        {
            var buffer = new byte[_websocketOptions.BufferSize];

            while (true)
            {
                try
                {
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer, 0, buffer.Length), token);

                    if (!result.CloseStatus.HasValue) continue;

                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                    break;

                } catch (TaskCanceledException canceledException)
                {
                    Console.WriteLine(canceledException.ToJsonString());
                    await socket.CloseAsync(WebSocketCloseStatus.Empty, "", CancellationToken.None);
                    break;
                } catch (Exception ex)
                {
                    Console.WriteLine(ex.ToJsonString());
                    throw;
                }
            }
        }*/
    }
}