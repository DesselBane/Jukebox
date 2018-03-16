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
        public Task<IEnumerable<Player>> GetAllPlayersAsync()
        {
            return _playerService.GetAllPlayersAsync();
        }

        [HttpGet("{playerId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Player))]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            return _playerService.GetPlayerByIdAsync(playerId);
        }

        [HttpGet("ws")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.UnsupportedMediaType, typeof(ExceptionDTO), Description = PlayerErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST + "\nRequest must be a Websocket request")]
        public async Task CreateWebSocketAsync()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await _playerService.CreateSocketPlayerAsync(socket);
            }
            else
            {
                throw new UnsupportedMediaTypeException("Request has to be a Websocket request", Guid.Parse(PlayerErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST));
            }
        }

        [HttpPost("{playerId}/addSong/{songId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(void))]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = SongErrorCodes.SONG_NOT_FOUND + "\nSong not found")]
        public Task AddSongToPlayer(int playerId, int songId)
        {
            return _playerService.AddSongToPlayerAsync(playerId, songId);
        }

        [HttpPost("{playerId}/executeCommand")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(void), Description = "Command executed successfully")]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = PlayerErrorCodes.NO_PERMISSION_TO_UPDATE_PLAYER + "\nNo permission to update player.")]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description = PlayerErrorCodes.PLAYER_NOT_FOUND + "\nPlayer not found.")]
        public virtual Task ExecutePlayerCommand([FromBody] PlayerCommand cmd, int playerId)
        {
            return _playerService.ExecuteCommandAsync(playerId,cmd);
        }
    }
}