﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Extensions;

namespace Jukebox.Common.Security
{
    public class AuthenticationValidator
    {
        #region Vars

        private readonly DataContext _securityContext;

        #endregion

        #region Constructors

        public AuthenticationValidator(DataContext securityContext)
        {
            _securityContext = securityContext;
        }

        #endregion

        public void ValidateUsername(string username)
        {
            if (!username.IsValidEmail())
                throw new UnprocessableEntityException("Username has to be an EMail", Guid.Parse(AuthenticationErrorCodes.USERNAME_NO_EMAIL));
        }

        public void ValidateUserExists(string username)
        {
            if (!_securityContext.Users.Any(x => string.Equals(x.EMail, username, StringComparison.CurrentCultureIgnoreCase)))
                throw new NotFoundException(username, nameof(User), Guid.Parse(AuthenticationErrorCodes.USER_NOT_FOUND));
        }

        public void ValidateUsernameDoesntExist(string username)
        {
            if (_securityContext.Users.Any(x => string.Equals(x.EMail, username, StringComparison.CurrentCultureIgnoreCase)))
                throw new ConflictException("Username already exists", Guid.Parse(AuthenticationErrorCodes.USERNAME_EXISTS_ALREADY));
        }

        public void ValidateResetHashExists(string resetHash)
        {
            if (!_securityContext.Users.Any(x => x.ResetHash == resetHash))
                throw new NotFoundException("", "ResetHash doesnt Exist", Guid.Parse(AuthenticationErrorCodes.RESET_HAST_DOESNT_EXIST));
        }

        public JwtSecurityToken ValidateJwtToken(string token)
        {
            var jwtHandler = new JwtSecurityTokenHandler();

            if (!jwtHandler.CanReadToken(token))
                throw new UnauthorizedException("Invalid Access Token", Guid.Parse(AuthenticationErrorCodes.ACCESS_TOKEN_INVALID));
            
            return jwtHandler.ReadJwtToken(token);
        }
    }
}