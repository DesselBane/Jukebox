using Jukebox.LastFm.Abstractions;
using Jukebox.LastFm.Abstractions.Services;

namespace Jukebox.LastFm
{
    public class LastFmClient : ILastFmClient
    {
        public IArtistApi ArtistApi { get; }
        
        public LastFmClient(IArtistApi artistApi)
        {
            ArtistApi = artistApi;
        }
        
        
    }
}