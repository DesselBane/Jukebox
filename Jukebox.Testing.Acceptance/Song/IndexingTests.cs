using System;
using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Extensions;
using Jukebox.Testing.Acceptance.Extensions;
using Xunit;

namespace Jukebox.Testing.Acceptance.Song
{
    public class IndexingTests : TestBase
    {
        [Fact]
        public async Task IndexSongs_403_Forbidden()
        {
            await _Client.SetupAuthenticationAsync(_Context);

            var r = await _Client.PostAsync("api/song/index", "".ToStringContent());

            var error = await r.GetErrorObjectAsync();
            
            Assert.Equal(HttpStatusCode.Forbidden,r.StatusCode);
            Assert.Equal(Guid.Parse(SongErrorCodes.NO_PERMISSION_TO_START_INDEXING),error.ErrorCode);
        }

        [Fact]
        public async Task IndexSongs_200_SysAdmin()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var r = await _Client.PostAsync("api/song/index", "".ToStringContent());
            r.EnsureSuccessStatusCode();
        }
        
        [Fact]
        public async Task IndexSongs_200_IndexAdmin()
        {
            var user = await _Context.CreateUserAsync();
            await user.GiveIndexAdminRoleAsync(_Context);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var r = await _Client.PostAsync("api/song/index", "".ToStringContent());
            r.EnsureSuccessStatusCode();
        }
    }
}