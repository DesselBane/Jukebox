using System;
using System.Collections.Generic;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Players;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [SwaggerResponse(HttpStatusCode.Created, typeof(Guid))]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = PlayerErrorCodes.NO_PERMISSION_TO_CREATE_PLAYER + "\nNo permission to create player")]
        [SwaggerResponse(HttpStatusCode.Conflict, typeof(ExceptionDTO), Description  = PlayerErrorCodes.PLAYER_NAME_CONFLICT + "\nPlayer name conflict")]
        public Task<Guid> CreatePlayerAsync([FromBody] Player player)
        {
            HttpContext.Response.StatusCode = (int) HttpStatusCode.Created;
            return _playerService.CreatePlayerAsync(player);
        }

        [HttpGet("ws")]
        [AllowAnonymous]
        [SwaggerResponse(422,typeof(ExceptionDTO), Description = PlayerErrorCodes.MALFORMED_PLAYER_GUID + "\nPlayer GUID is no GUID")]
        [SwaggerResponse(422,typeof(ExceptionDTO), Description = PlayerErrorCodes.UNKNOWN_PLAYER_GUID + "\nPlayer GUID is unknown")]
        [SwaggerResponse(HttpStatusCode.UnsupportedMediaType,typeof(ExceptionDTO), Description = PlayerErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST + "\nRequest must be a Websocket request")]
        public async Task CreateWebSocketAsync([FromQuery] string playerGuid)
        {
            if (!Guid.TryParse(playerGuid, out var playerGuidId))
            {
                throw new UnprocessableEntityException("Unknown player guid",Guid.Parse(PlayerErrorCodes.MALFORMED_PLAYER_GUID));
            }
            
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await _playerService.CreateSocketPlayerAsync(socket, playerGuidId);
            } else
            {
                throw new UnsupportedMediaTypeException("Request has to be a Websocket request",Guid.Parse(PlayerErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST));
            }
        }
    }
}