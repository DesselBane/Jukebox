using Jukebox.LastFm.Abstractions.Services;

namespace Jukebox.LastFm.Abstractions
{
    public interface ILastFmClient
    {
        IArtistApi ArtistApi { get; }
    }
}