using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Players;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class PlayerController : Controller
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(IEnumerable<Player>))]
        public Task<IEnumerable<Player>> GetAllPlayersAsync() => _playerService.GetAllPlayersAsync();

        [HttpGet("{playerId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Player))]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task<Player> GetPlayerByIdAsync(int playerId) => _playerService.GetPlayerByIdAsync(playerId);

        [HttpPut]
        [SwaggerResponse(HttpStatusCode.Created, typeof(Player))]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = PlayerErrorCodes.NO_PERMISSION_TO_CREATE_PLAYER + "\nNo permission to create player")]
        [SwaggerResponse(HttpStatusCode.Conflict, typeof(ExceptionDTO), Description  = PlayerErrorCodes.PLAYER_NAME_CONFLICT + "\nPlayer name conflict")]
        public Task<Player> CreatePlayerAsync([FromBody] Player player)
        {
            HttpContext.Response.StatusCode = (int) HttpStatusCode.Created;
            return _playerService.CreatePlayerAsync(player);
        }

        [HttpPost("{playerId}")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Player))]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = PlayerErrorCodes.NO_PERMISSION_TO_UPDATE_PLAYER + "\nNo permission to update player")]
        [SwaggerResponse(HttpStatusCode.Conflict, typeof(ExceptionDTO), Description  = PlayerErrorCodes.PLAYER_NAME_CONFLICT + "\nPlayer name conflict")]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description  = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task<Player> UpdatePlayerAsync([FromBody] Player player, int playerId)
        {
            player.Id = playerId;
            return _playerService.UpdatePlayerAsync(player);
        }

        [HttpDelete("{playerId}")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(void))]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = PlayerErrorCodes.NO_PERMISSION_TO_DELETE_PLAYER + "\nNo permission to delete player")]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description  = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task DeletePlayerAsync(int playerId) => _playerService.DeletePlayerAsync(playerId);
    }
}