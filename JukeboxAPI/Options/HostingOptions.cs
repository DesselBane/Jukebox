using Jukebox.Common.Abstractions.Options;

namespace Jukebox.Options
{
    public class HostingOptions : IHostingOptions
    {
        public string Url { get; set; }
    }
}