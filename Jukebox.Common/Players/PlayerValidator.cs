using System;
using System.Linq;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;

namespace Jukebox.Common.Players
{
    public class PlayerValidator
    {
        private readonly IPlayerRepository _playerRepository;

        public PlayerValidator(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }
        
        public void ValidatePlayerExists(int playerId)
        {
            if(!_playerRepository.Any(x => x.player.Id == playerId))
                throw new NotFoundException(playerId.ToString(), nameof(Player), Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND));
        }

        public void ValidateCanUpdatePlayer()
        {
            //TODO add actual validation
        }
    }
}