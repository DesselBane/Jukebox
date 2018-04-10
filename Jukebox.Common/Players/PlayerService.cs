using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Notification;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Players;
using Jukebox.Common.Extensions;
using Jukebox.Common.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Jukebox.Common.Players
{
    public class PlayerService : IPlayerService
    {
        private static readonly object                                 _NOTIFICATION_SYNC_HANDLE = new object();
        private readonly        AuthenticationValidator                _authValidator;
        private readonly        DataContext                            _dataContext;
        private readonly        List<(int playerId, WebSocket socket)> _notificationChannels = new List<(int playerId, WebSocket socket)>();
        private readonly        INotificationService                   _notificationService;
        private readonly        IPlayerRepository                      _playerRepository;
        private readonly        WebsocketOptions                       _websocketOptions;


        public PlayerService(IOptionsMonitor<WebsocketOptions> websocketOptions,
                             AuthenticationValidator    authValidator,
                             DataContext                dataContext,
                             IPlayerRepository          playerRepository,
                             INotificationService       notificationService)
        {
            _authValidator       = authValidator;
            _dataContext         = dataContext;
            _playerRepository    = playerRepository;
            _notificationService = notificationService;
            _websocketOptions    = websocketOptions.CurrentValue;
        }

        public Task<IEnumerable<Player>> GetAllPlayersAsync()
        {
            return Task.FromResult(_playerRepository.Select(x => x.player)
                                                    .AsEnumerable());
        }

        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            return Task.FromResult(_playerRepository.Select(x => x.player)
                                                    .FirstOrDefault(x => x.Id == playerId));
        }

        public async Task CreateSocketPlayerAsync(WebSocket socket)
        {
            var player = await InitializePlayer(socket);

            if (player == null)
                return;

            await _notificationService.NotifyClientsAsync(new Notification(NotificationChannel.AvailablePlayers));
            
            await HandlePlayerOwnerWebsocket(player, socket);

            _playerRepository.RemoveByPlayerId(player.Id);
        }

        public async Task AddSongToPlayerAsync(int playerId,
                                               int songId)
        {
            var player = _playerRepository.FirstOrDefault(x => x.player.Id == playerId);
            var song   = await _dataContext.Songs.FirstOrDefaultAsync(x => x.Id == songId);

            player.player.Playlist.Add(song);

            await player.socket.SendShortAsync(new PlayerCommand(PlayerCommandTypes.PlaylistUpdate));

            NotifyClients(playerId);
        }

        public async Task ExecuteCommandAsync(int           playerId,
                                              PlayerCommand cmd)
        {
            var player = _playerRepository.First(x => x.player.Id == playerId);

            await player.socket.SendShortAsync(cmd);
        }

        private Task NotifyClients(int playerId)
        {
            return _notificationService.NotifyClientsAsync(new Notification(NotificationChannel.PlayerInfo, new[] {"playerId", playerId.ToString()}));
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
                } catch (JsonSerializationException)
                {
                    continue;
                } catch (InvalidRestOperationException ex) when (ex is UnauthorizedException || ex is NotFoundException)
                {
                    await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Unauthorized", CancellationToken.None);
                    return null;
                }

                var player = new Player
                             {
                                 Name          = msg.PlayerName,
                                 Id            = 0,
                                 State         = PlayerState.Stopped,
                                 PlaylistIndex = 0
                             };

                _playerRepository.Add((player, socket));

                await socket.SendShortAsync(new PlayerCommand(PlayerCommandTypes.Init, new List<string[]>
                                                                                       {
                                                                                           new[] {"playerId", player.Id.ToString()}
                                                                                       }));

                return player;
            }
        }

        private async Task HandlePlayerOwnerWebsocket(Player    player,
                                                      WebSocket socket)
        {
            try
            {
                while (true)
                {
                    var buffer = new byte[_websocketOptions.BufferSize];
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.CloseStatus.HasValue)
                    {
                        await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                        throw new Exception("Trigger catch block");
                    }

                    HandlePlayerMessage(Encoding.ASCII.GetString(buffer), player.Id);
                }
            } catch
            {
                _playerRepository.RemoveByPlayerId(player.Id);
            }
            
        }

        private void HandlePlayerMessage(string message,
                                         int    playerId)
        {
            var newPlayer     = JsonConvert.DeserializeObject<Player>(message);
            var playerChannel = _playerRepository.First(x => x.player.Id == playerId);
            
            playerChannel.player.Name          = newPlayer.Name;
            playerChannel.player.PlaylistIndex = newPlayer.PlaylistIndex;
            playerChannel.player.State         = newPlayer.State;

            NotifyClients(playerId);
        }

    }
}