using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class PlayerController : Controller
    {

        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK,typeof(IEnumerable<Player>))]
        public Task<IEnumerable<Player>> GetAllPlayersAsync()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{playerId}")]
        [SwaggerResponse(HttpStatusCode.OK,typeof(Player))]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        [SwaggerResponse(HttpStatusCode.Created,typeof(Player))]
        [SwaggerResponse(HttpStatusCode.Forbidden,typeof(ExceptionDTO),Description = PlayerErrorCodes.NO_PERMISSION_TO_CREATE_PLAYER + "\nNo permission to create player")]
        [SwaggerResponse(HttpStatusCode.Conflict,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NAME_CONFLICT + "\nPlayer name conflict")]
        public Task<Player> CreatePlayerAsync([FromBody] Player player)
        {
            throw new NotImplementedException();
        }

        [HttpPost("{playerId}")]
        [SwaggerResponse(HttpStatusCode.OK,typeof(Player))]
        [SwaggerResponse(HttpStatusCode.Forbidden,typeof(ExceptionDTO),Description = PlayerErrorCodes.NO_PERMISSION_TO_UPDATE_PLAYER + "\nNo permission to update player")]
        [SwaggerResponse(HttpStatusCode.Conflict,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NAME_CONFLICT + "\nPlayer name conflict")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task<Player> UpdatePlayerAsync([FromBody] Player player, int playerId)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{playerId}")]
        [SwaggerResponse(HttpStatusCode.OK,typeof(void))]
        [SwaggerResponse(HttpStatusCode.Forbidden,typeof(ExceptionDTO),Description = PlayerErrorCodes.NO_PERMISSION_TO_DELETE_PLAYER + "\nNo permission to delete player")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task DeletePlayerAsync(int playerId)
        {
            throw new NotImplementedException();
        }
    }
}