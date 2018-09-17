using System;
using System.Threading.Tasks;
using Jukebox.LastFm.Abstractions.ResponseModels;

namespace Jukebox.LastFm.Abstractions.Services
{
    public interface IArtistApi
    {
        Task<ArtistInfo> GetArtistInfoAsync(string artistName, Guid? mbid = null, string lang = null, bool? autocorrect = null);
        Task<ArtistInfo> GetArtistInfoAsync(Guid mbid, string artistName = null, string lang = null, bool? autocorrect = null);
    }
}