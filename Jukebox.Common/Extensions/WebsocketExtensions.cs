﻿using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Jukebox.Common.Extensions
{
    public static class WebsocketExtensions
    {
        public static Task SendShortAsync(this WebSocket socket,object data, CancellationToken cancelToken = default (CancellationToken))
        {
            return socket.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(data))), WebSocketMessageType.Text, true, cancelToken);
        }
    }
}