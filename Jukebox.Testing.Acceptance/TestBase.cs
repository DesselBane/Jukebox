// Needed for Extension method GetService<>
// ReSharper disable once RedundantUsingDirective

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Claims;
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

        public const string ALL_TIME_PASSWORD = "superSecretBla123";

        #endregion

        #region Constructors

        public TestBase()
        {
            var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT_TEST");

            if (string.IsNullOrWhiteSpace(envName))
                envName = "integrationTest";

            var fullName = GetType().Assembly.Location;

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

        protected DataContext CreateDataContext() => _Server.Host.Services.GetRequiredService<DataContext>();

        #endregion Helper

        #region Vars

        protected readonly HttpClient  _Client;
        protected readonly DataContext _Context;
        protected readonly TestServer  _Server;

        #endregion
    }
}