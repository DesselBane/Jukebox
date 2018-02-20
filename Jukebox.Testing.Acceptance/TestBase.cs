// Needed for Extension method GetService<>
// ReSharper disable once RedundantUsingDirective

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Extensions;
using Jukebox.Common.Security;
using Jukebox.DataTransferObjects;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Jukebox.Testing.Acceptance
{
    public class TestBase : IDisposable
    {
        #region Const

        protected const string ALL_TIME_PASSWORD = "superSecretBla123";

        #endregion

        #region Vars

        protected readonly HttpClient _Client;
        protected readonly DataContext _Context;
        protected readonly TestServer _Server;

        #endregion

        #region Constructors

        public TestBase()
        {
            var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT_TEST");

            if (string.IsNullOrWhiteSpace(envName))
                envName = "integrationTest";

            var fullName = this.GetType().Assembly.Location;
            
            var config = new ConfigurationBuilder()
                .SetBasePath(fullName.Remove(fullName.LastIndexOf('\\')))
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{envName}.json", true)
                .AddEnvironmentVariables()
                .Build();
            
            _Server = new TestServer(new WebHostBuilder()
                .UseEnvironment(envName)
                .UseWebRoot("../../../../JukeboxAPI/wwwroot")
                .UseConfiguration(config)
                .UseStartup<IntStartup>());

            _Client = _Server.CreateClient();

            _Context = CreateDataContext();
            _Context.Database.Migrate();
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            _Context.Database.EnsureDeleted();
        }

        #endregion

        #region Helper

        protected async Task<User> CreateUserAsync()
        {
            var user = CreateUser();

            _Context.Users.Add(user);
            await _Context.SaveChangesAsync();
            return user;
        }
        
        protected User CreateUser()
        {
            var username = Guid.NewGuid() + "@gmx.de";
            var password = ALL_TIME_PASSWORD;
            var passwordHash = password.HashPassword();
            var user = new User
            {
                EMail = username,
                Password = passwordHash.Item1,
                Salt = passwordHash.Item2,
            };

            user.Claims.Add(new UsernameClaim(username));
            return user;
        }

        protected async Task SetupBasicAuthenticationAsync(HttpClient client, string username, string password = ALL_TIME_PASSWORD)
        {
            var loginResponse = await client.PostAsync("/api/auth/login",
                new LoginDTO {Username = username, Password = password}.ToStringContent());
            var loginContent = JsonConvert.DeserializeObject<AuthToken>(await loginResponse.Content.ReadAsStringAsync());

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer ", loginContent.AccessToken);
        }

        protected async Task<User> SetupAuthenticationAsync()
        {
            var user = CreateUser();
            _Context.Users.Add(user);
            await _Context.SaveChangesAsync();

            await SetupBasicAuthenticationAsync(_Client, user.EMail);
            return user;
        }

        protected DataContext CreateDataContext()
        {
            return _Server.Host.Services.GetRequiredService<DataContext>();
        }

        #endregion Helper
    }
}