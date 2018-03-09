using System;
using System.Security.Claims;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.Claims;
using Jukebox.Common.Abstractions.ErrorCodes;

namespace Jukebox.Common.Songs
{
    public class IndexingValidator
    {
        private readonly ClaimsIdentity _identity;

        public IndexingValidator(ClaimsIdentity identity)
        {
            _identity = identity;
        }

        public void HasPermissionToStartIndexing()
        {
            if (!_identity.HasClaim(RoleClaim.ROLE_CLAIM_TYPE, RoleClaimTypes.IndexAdmin.ToString()) &&
                !_identity.HasClaim(RoleClaim.ROLE_CLAIM_TYPE, RoleClaimTypes.SystemAdmin.ToString()))
                throw new ForbiddenException("User not permitted to start indexing", Guid.Parse(SongErrorCodes.NO_PERMISSION_TO_START_INDEXING));
        }
    }
}