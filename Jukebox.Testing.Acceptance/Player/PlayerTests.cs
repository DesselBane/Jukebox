using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Extensions;
using Jukebox.Testing.Acceptance.Extensions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Xunit;
using PlayerObj = Jukebox.Common.Abstractions.DataModel.Player;

namespace Jukebox.Testing.Acceptance.Player
{
    public class PlayerTests : TestBase
    {
        [Fact]
        public async Task CreatePlayer_201_Success_PlayerAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantCreatePlayerRight(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PutAsync("api/player", player.ToStringContent());

            Assert.Equal(HttpStatusCode.Created, r.StatusCode);

            var result = JsonConvert.DeserializeObject<PlayerObj>(await r.Content.ReadAsStringAsync());

            Assert.NotNull(result);
            Assert.NotEqual(0, result.Id);
            Assert.Equal(player.Name, result.Name);

            result = await CreateDataContext().Players.FirstOrDefaultAsync(x => x.Name == player.Name);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task CreatePlayer_201_Success_SysAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PutAsync("api/player", player.ToStringContent());

            Assert.Equal(HttpStatusCode.Created, r.StatusCode);

            var result = JsonConvert.DeserializeObject<PlayerObj>(await r.Content.ReadAsStringAsync());

            Assert.NotNull(result);
            Assert.NotEqual(0, result.Id);
            Assert.Equal(player.Name, result.Name);

            result = await CreateDataContext().Players.FirstOrDefaultAsync(x => x.Name == player.Name);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task CreatePlayer_403_Forbidden()
        {
            await _Client.SetupAuthenticationAsync(_Context);

            var player = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PutAsync("api/player", player.ToStringContent());

            Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);
            var error = await r.GetErrorObjectAsync();
            Assert.Equal(Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_CREATE_PLAYER), error.ErrorCode);
        }

        [Fact]
        public async Task CreatePlayer_409_Conflict()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player = await _Context.CreatePlayerAsync();

            var r = await _Client.PutAsync("api/player", player.ToStringContent());

            Assert.Equal(HttpStatusCode.Conflict, r.StatusCode);

            var error = await r.GetErrorObjectAsync();

            Assert.Equal(Guid.Parse(PlayerErrorCodes.PLAYER_NAME_CONFLICT), error.ErrorCode);
        }

        [Fact]
        public async Task DeletePlayer_200_Success_PlayerAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantDeletePlayerRight(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player = await _Context.CreatePlayerAsync();

            var r = await _Client.DeleteAsync($"api/player/{player.Id}");
            r.EnsureSuccessStatusCode();

            Assert.Null(await CreateDataContext().Players.FirstOrDefaultAsync(x => x.Id == player.Id));
        }

        [Fact]
        public async Task DeletePlayer_200_Success_SysAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player = await _Context.CreatePlayerAsync();

            var r = await _Client.DeleteAsync($"api/player/{player.Id}");
            r.EnsureSuccessStatusCode();

            Assert.Null(await CreateDataContext().Players.FirstOrDefaultAsync(x => x.Id == player.Id));
        }

        [Fact]
        public async Task DeletePlayer_403_Forbidden()
        {
            await _Client.SetupAuthenticationAsync(_Context);

            var player = await _Context.CreatePlayerAsync();

            var r = await _Client.DeleteAsync($"api/player/{player.Id}");

            Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);

            var error = await r.GetErrorObjectAsync();

            Assert.Equal(Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_DELETE_PLAYER), error.ErrorCode);
        }

        [Fact]
        public async Task DeletePlayer_404_NotFound()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var r = await _Client.DeleteAsync("api/player/999");

            Assert.Equal(HttpStatusCode.NotFound, r.StatusCode);
            var error = await r.GetErrorObjectAsync();
            Assert.Equal(Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND), error.ErrorCode);
        }

        [Fact]
        public async Task GetAllPlayers_200_Success()
        {
            var pl1 = await _Context.CreatePlayerAsync();
            var pl2 = await _Context.CreatePlayerAsync();

            var r = await _Client.GetAsync("api/player");
            r.EnsureSuccessStatusCode();

            var players = JsonConvert.DeserializeObject<List<PlayerObj>>(await r.Content.ReadAsStringAsync());

            Assert.Equal(2, players.Count);
            Assert.True(players.Any(x => x.Name == pl1.Name));
            Assert.True(players.Any(x => x.Name == pl2.Name));
        }

        [Fact]
        public async Task GetPlayerById_200_Success()
        {
            var player = await _Context.CreatePlayerAsync();

            var r = await _Client.GetAsync($"api/player/{player.Id}");
            r.EnsureSuccessStatusCode();

            var playerResponse = JsonConvert.DeserializeObject<PlayerObj>(await r.Content.ReadAsStringAsync());

            Assert.Equal(player.Id, playerResponse.Id);
            Assert.Equal(player.Name, playerResponse.Name);
        }

        [Fact]
        public async Task GetPlayerById_404_NotFound()
        {
            var r = await _Client.GetAsync("api/player/999");

            Assert.Equal(HttpStatusCode.NotFound, r.StatusCode);
            var error = await r.GetErrorObjectAsync();
            Assert.Equal(Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND), error.ErrorCode);
        }

        [Fact]
        public async Task UpdatePlayer_200_Success_PlayerAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantUpdatePlayerRight(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player    = await _Context.CreatePlayerAsync();
            var newPlayer = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PostAsync($"api/player/{player.Id}", newPlayer.ToStringContent());
            r.EnsureSuccessStatusCode();

            var result = JsonConvert.DeserializeObject<PlayerObj>(await r.Content.ReadAsStringAsync());

            Assert.NotNull(result);
            Assert.Equal(newPlayer.Name, result.Name);
            Assert.Equal(player.Id, result.Id);
            Assert.Equal(newPlayer.IsActive, result.IsActive);

            result = await CreateDataContext().Players
                                              .FirstOrDefaultAsync(x => x.IsActive == newPlayer.IsActive &&
                                                                        x.Name == newPlayer.Name);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpdatePlayer_200_Success_SysAdm()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player    = await _Context.CreatePlayerAsync();
            var newPlayer = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PostAsync($"api/player/{player.Id}", newPlayer.ToStringContent());
            r.EnsureSuccessStatusCode();

            var result = JsonConvert.DeserializeObject<PlayerObj>(await r.Content.ReadAsStringAsync());

            Assert.NotNull(result);
            Assert.Equal(newPlayer.Name, result.Name);
            Assert.Equal(player.Id, result.Id);
            Assert.Equal(newPlayer.IsActive, result.IsActive);

            result = await CreateDataContext().Players
                                              .FirstOrDefaultAsync(x => x.IsActive == newPlayer.IsActive &&
                                                                        x.Name == newPlayer.Name);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpdatePlayer_403_Forbidden()
        {
            await _Client.SetupAuthenticationAsync(_Context);

            var player    = await _Context.CreatePlayerAsync();
            var newPlayer = PlayerTestExtensions.CreateDefaultPlayer();

            var r = await _Client.PostAsync($"api/player/{player.Id}", newPlayer.ToStringContent());

            Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);

            var error = await r.GetErrorObjectAsync();

            Assert.Equal(Guid.Parse(PlayerErrorCodes.NO_PERMISSION_TO_UPDATE_PLAYER), error.ErrorCode);
        }

        [Fact]
        public async Task UpdatePlayer_404_NotFound()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player    = await _Context.CreatePlayerAsync();
            var newPlayer = PlayerTestExtensions.CreateDefaultPlayer();
            newPlayer.Id = player.Id;

            var r = await _Client.PostAsync("api/player/999", newPlayer.ToStringContent());

            Assert.Equal(HttpStatusCode.NotFound, r.StatusCode);

            var error = await r.GetErrorObjectAsync();

            Assert.Equal(Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND), error.ErrorCode);
        }

        [Fact]
        public async Task UpdatePlayer_409_Conflict()
        {
            var user = await _Context.CreateUserAsync();
            await _Context.GrantSystemAdminRoleAsync(user);
            await _Client.SetupBasicAuthenticationAsync(user.EMail);

            var player      = await _Context.CreatePlayerAsync();
            var otherPlayer = await _Context.CreatePlayerAsync();
            var newPlayer   = PlayerTestExtensions.CreateDefaultPlayer();
            newPlayer.Name = otherPlayer.Name;

            var r = await _Client.PostAsync($"api/player/{player.Id}", newPlayer.ToStringContent());

            Assert.Equal(HttpStatusCode.Conflict, r.StatusCode);

            var error = await r.GetErrorObjectAsync();

            Assert.Equal(Guid.Parse(PlayerErrorCodes.PLAYER_NAME_CONFLICT), error.ErrorCode);
        }
    }
}