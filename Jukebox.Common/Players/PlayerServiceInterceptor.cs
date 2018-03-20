using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Players;
using Jukebox.Common.Songs;

namespace Jukebox.Common.Players
{
    public class PlayerServiceInterceptor : InterceptingMappingBase, IPlayerService
    {
        private readonly PlayerValidator _playerValidator;
        private readonly SongValidator _songValidator;

        public PlayerServiceInterceptor(PlayerValidator playerValidator, SongValidator songValidator)
        {
            _playerValidator = playerValidator;
            _songValidator = songValidator;
            
            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(GetPlayerByIdAsync),
                            x => GetPlayerByIdAsync((int) x.Arguments[0])
                        },
                        {
                            nameof(AddSongToPlayerAsync),
                            x => AddSongToPlayerAsync((int) x.Arguments[0], (int) x.Arguments[1])
                        },
                        {
                            nameof(ExecuteCommandAsync),
                            x => ExecuteCommandAsync((int) x.Arguments[0],(PlayerCommand) x.Arguments[1])
                        },
                        {
                            nameof(CreateNotificationSocketAsync),
                            x => CreateNotificationSocketAsync((WebSocket) x.Arguments[0],(int) x.Arguments[1])
                        }
                    });
        }
        
        public Task<IEnumerable<Player>> GetAllPlayersAsync()
        {
            return null;
        }

        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            _playerValidator.ValidatePlayerExists(playerId);
            
            return null;
        }

        public Task CreateSocketPlayerAsync(WebSocket socket)
        {
            return null;
        }

        public Task AddSongToPlayerAsync(int playerId, int songId)
        {
            _playerValidator.ValidatePlayerExists(playerId);
            _songValidator.ValidateSongExists(songId);

            return null;
        }

        public Task ExecuteCommandAsync(int playerId, PlayerCommand cmd)
        {
            _playerValidator.ValidatePlayerExists(playerId);
            _playerValidator.ValidateCanUpdatePlayer();
            
            
            return null;
        }

        public Task CreateNotificationSocketAsync(WebSocket socket, int playerId)
        {
            _playerValidator.ValidatePlayerExists(playerId);
            
            return null;
        }
    }
}