using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Extensions;

namespace Jukebox.Common.Security
{
    public class AuthenticationServiceInterceptor : InterceptingMappingBase, IAuthenticationService
    {
        #region Vars

        private readonly AuthenticationValidator _authenticationValidator;

        #endregion

        #region Constructors

        public AuthenticationServiceInterceptor(AuthenticationValidator authenticationValidator)
        {
            _authenticationValidator = authenticationValidator;
            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(AuthenticateAsync),
                            x => AuthenticateAsync((string) x.Arguments[0], (string) x.Arguments[1])
                        },
                        {
                            nameof(AuthenticateTokenAsync),
                            x => AuthenticateTokenAsync((AuthToken) x.Arguments[0])
                        },
                        {
                            nameof(RegisterUserAsync),
                            x => RegisterUserAsync((string) x.Arguments[0])
                        },
                        {
                            nameof(ChangePasswordAsync),
                            x => ChangePasswordAsync((string) x.Arguments[0], (string) x.Arguments[1])
                        },
                        {
                            nameof(ResetPasswordAsync),
                            x => ResetPasswordAsync((string) x.Arguments[0])
                        },
                        {
                            nameof(ChangeUsernameAsync),
                            x => ChangeUsernameAsync((string) x.Arguments[0], (ClaimsIdentity) x.Arguments[1])
                        },
                        {
                            nameof(DeleteAccountAsync),
                            x => DeleteAccountAsync((ClaimsIdentity) x.Arguments[0])
                        },
                        {
                            nameof(GetCurrentUserAsync),
                            x => GetCurrentUserAsync()
                        }
                    });
        }

        #endregion

        #region Implementation of IAuthenticationService

        public Task<AuthToken> AuthenticateAsync(string username, string password) => null;

        public Task<AuthToken> AuthenticateTokenAsync(AuthToken token)
        {
            _authenticationValidator.ValidateJwtToken(token.AccessToken);
            return null;
        }

        public Task RegisterUserAsync(string username)
        {
            _authenticationValidator.ValidateUsername(username);
            _authenticationValidator.ValidateUsernameDoesntExist(username);

            return null;
        }

        public Task ChangePasswordAsync(string newPassword, string resetHash)
        {
            _authenticationValidator.ValidateResetHashExists(resetHash);
            return null;
        }

        public Task ResetPasswordAsync(string username)
        {
            _authenticationValidator.ValidateUserExists(username);

            return null;
        }

        public Task<AuthToken> ChangeUsernameAsync(string username, ClaimsIdentity ident)
        {
            _authenticationValidator.ValidateUsername(username);
            _authenticationValidator.ValidateUsernameDoesntExist(username);
            _authenticationValidator.ValidateUserExists(ident.GetUsername());

            return null;
        }

        public Task DeleteAccountAsync(ClaimsIdentity ident)
        {
            _authenticationValidator.ValidateUserExists(ident.GetUsername());
            return null;
        }

        public Task<User> GetCurrentUserAsync() => null;

        #endregion
    }
}