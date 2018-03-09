using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Players;

namespace Jukebox.Common.Players
{
    public class PlayerServiceInterceptor : InterceptingMappingBase, IPlayerService
    {
        private readonly PlayerValidator _playerValidator;

        public PlayerServiceInterceptor(PlayerValidator playerValidator)
        {
            _playerValidator = playerValidator;
            
            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(GetAllPlayersAsync),
                            x => GetAllPlayersAsync()
                        },
                        {
                            nameof(GetPlayerByIdAsync),
                            x => GetPlayerByIdAsync((int) x.Arguments[0])
                        },
                        {
                            nameof(CreatePlayerAsync),
                            x => CreatePlayerAsync((Player) x.Arguments[0])
                        },
                        {
                            nameof(UpdatePlayerAsync),
                            x => UpdatePlayerAsync((Player) x.Arguments[0])
                        },
                        {
                            nameof(DeletePlayerAsync),
                            x => DeletePlayerAsync((int) x.Arguments[0])
                        }
                    });
        }
        
        public Task<IEnumerable<Player>> GetAllPlayersAsync() => null;

        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            _playerValidator.ValidatePlayerExists(playerId);
            return null;
        }

        public Task<Player> CreatePlayerAsync(Player player)
        {
            _playerValidator.ValidateHasPermissionCreate();
            _playerValidator.ValidateNameDoesntExist(player.Name);

            return null;
        }

        public Task<Player> UpdatePlayerAsync(Player player)
        {
            _playerValidator.ValidateHasPermissionUpdate();
            _playerValidator.ValidatePlayerExists(player.Id);
            _playerValidator.ValidateNameDoesntExist(player.Name);

            return null;
        }

        public Task DeletePlayerAsync(int playerId)
        {
            _playerValidator.ValidateHasPermissionDelete();
            _playerValidator.ValidatePlayerExists(playerId);

            return null;
        }
    }
}