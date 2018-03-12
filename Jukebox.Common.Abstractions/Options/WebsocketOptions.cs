using System;

namespace Jukebox.Common.Abstractions.Options
{
    public class WebsocketOptions
    {
        public TimeSpan KeepAliveInterval { get; set; }
        public int BufferSize { get; set; }
    }
}