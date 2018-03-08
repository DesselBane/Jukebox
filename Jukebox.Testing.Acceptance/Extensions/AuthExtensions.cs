using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.Claims;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Extensions;
using Jukebox.Common.Security;
using Jukebox.DataTransferObjects;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Jukebox.Testing.Acceptance.Extensions
{
    public static class AuthExtensions
    {
        public static async Task SetupBasicAuthenticationAsync(this HttpClient client, string username, string password = TestBase.ALL_TIME_PASSWORD)
        {
            var loginResponse = await client.PostAsync("/api/auth/login",
                                                       new LoginDTO {Username = username, Password = password}.ToStringContent());
            var loginContent = JsonConvert.DeserializeObject<AuthToken>(await loginResponse.Content.ReadAsStringAsync());

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginContent.AccessToken);
        }
        
        public static User CreateUser()
        {
            var username     = Guid.NewGuid() + "@gmx.de";
            var password     = TestBase.ALL_TIME_PASSWORD;
            var passwordHash = password.HashPassword();
            var user = new User
                       {
                           EMail    = username,
                           Password = passwordHash.Item1,
                           Salt     = passwordHash.Item2
                       };

            user.Claims.Add(new UsernameClaim(username));
            return user;
        }
        
        public static async Task<User> CreateUserAsync(this DataContext dataContext)
        {
            var user = CreateUser();

            dataContext.Users.Add(user);
            await dataContext.SaveChangesAsync();
            return user;
        }
        
        public static async Task<User> SetupAuthenticationAsync(this HttpClient client,DataContext dataContext)
        {
            var user = CreateUser();
            dataContext.Users.Add(user);
            await dataContext.SaveChangesAsync();

            await client.SetupBasicAuthenticationAsync(user.EMail);
            return user;
        }

        public static async Task<ExceptionDTO> GetErrorObjectAsync(this HttpResponseMessage httpResponseMessage)
        {
            return JsonConvert.DeserializeObject<ExceptionDTO>(await httpResponseMessage.Content.ReadAsStringAsync());
        }

        public static async Task GrantSystemAdminRoleAsync(this DataContext dataContext, User user)
        {
            var dbUser = await dataContext.Users
                                        .Include(x => x.Claims)
                                        .FirstOrDefaultAsync(x => x.Id == user.Id);
            
            if(dbUser == null)
                throw new InvalidOperationException();
            
            if(!dbUser.HasClaim(RoleClaim.ROLE_CLAIM_TYPE,RoleClaimTypes.SystemAdmin.ToString()))
                dbUser.Claims.Add(new RoleClaim(RoleClaimTypes.SystemAdmin));

            await dataContext.SaveChangesAsync();
        }
    }
}