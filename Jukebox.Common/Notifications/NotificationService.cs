using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Notification;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Extensions;

namespace Jukebox.Common.Notifications
{
    public class NotificationService : INotificationService
    {
        private readonly WebsocketOptions _websocketOptions;
        private List<WebSocket> _notificationChannels = new List<WebSocket>();

        public NotificationService(WebsocketOptions websocketOptions)
        {
            _websocketOptions = websocketOptions;
        }
        
        public Task NotifyClientsAsync(Notification notification)
        {
            return Task.Run(() => SendNotification(notification));
        }

        public Task CreateNotificationWebsocketAsync(WebSocket socket)
        {
            if (socket.State != WebSocketState.Open)
                return Task.CompletedTask;
            
            lock(_notificationChannels)
                _notificationChannels.Add(socket);

            return KeepNotificationChannelAlive(socket);
        }

        private async Task KeepNotificationChannelAlive(WebSocket socket)
        {
            try
            {
                while (true)
                {
                    var buffer = new byte[_websocketOptions.BufferSize];
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (!result.CloseStatus.HasValue)
                        continue;
                    
                    await socket.CloseAsync(result.CloseStatus.Value, socket.CloseStatusDescription, CancellationToken.None);
                    throw new Exception("Trigger catch block");
                }
            } catch
            {
                lock (_notificationChannels)
                {
                    _notificationChannels.Remove(socket);
                }
            }
            
            
        }
        
        private void SendNotification(Notification notification)
        {
            lock (_notificationChannels)
            {
                var channels = _notificationChannels.ToList();
                foreach (var socket in channels)
                {
                    try
                    {
                        socket.SendShortAsync(notification).Wait();
                    } catch
                    {
                        _notificationChannels.Remove(socket);
                    }
                }
            }
        }
    }
}