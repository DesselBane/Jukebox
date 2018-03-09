using System;
using System.Linq;
using System.Security.Claims;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.Claims;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;

namespace Jukebox.Common.Players
{
    public class PlayerValidator
    {
        private readonly DataContext _dataContext;
        private readonly ClaimsIdentity _identity;

        public PlayerValidator(DataContext dataContext, ClaimsIdentity identity)
        {
            _dataContext = dataContext;
            _identity = identity;
        }
        
        public void ValidatePlayerExists(int playerId)
        {
            if(!_dataContext.Players.Any(x => x.Id == playerId))
                throw new NotFoundException(playerId,nameof(Player),Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND)); 
        }

        public void ValidateHasPermissionCreate()
        {
            if(!HasPlayerOrSystemRole())
                throw new ForbiddenException("No permission to create player",Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_CREATE_PLAYER));
        }
        
        public void ValidateHasPermissionUpdate()
        {
            if(!HasPlayerOrSystemRole())
                throw new ForbiddenException("No permission to update player",Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_UPDATE_PLAYER));
        }
        
        public void ValidateHasPermissionDelete()
        {
            if(!HasPlayerOrSystemRole())
                throw new ForbiddenException("No permission to delete player",Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_DELETE_PLAYER));
        }

        public void ValidateNameDoesntExist(string playerName)
        {
            if(_dataContext.Players.Any(x => x.Name == playerName))
                throw new ConflictException("Player name conflict",Guid.Parse(PlayerErrorCodes.PLAYER_NAME_CONFLICT));
        }

        private bool HasPlayerOrSystemRole() => _identity.HasClaim(RoleClaim.ROLE_CLAIM_TYPE, RoleClaimTypes.PlayerAdmin.ToString()) || _identity.HasClaim(RoleClaim.ROLE_CLAIM_TYPE, RoleClaimTypes.SystemAdmin.ToString());
    }
}