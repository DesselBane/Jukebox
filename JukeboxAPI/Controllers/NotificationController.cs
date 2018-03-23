using System;
using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        
        [HttpGet("ws")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.UnsupportedMediaType,typeof(ExceptionDTO), Description = NotificationErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST + "\nRequest has to be a websocket request")]
        public async Task CreateNotificationSocketAsync()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await _notificationService.CreateNotificationWebsocketAsync(socket);
            }
            else
                throw new UnsupportedMediaTypeException("Request has to be a Websocket request",Guid.Parse(NotificationErrorCodes.HAS_TO_BE_WEBSOCKET_REQUEST));
        }
    }
}