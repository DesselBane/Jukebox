using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Microsoft.AspNetCore.Mvc;

namespace Jukebox.Common.Abstractions.Songs
{
    public interface ISongService
    {
        Task<IEnumerable<Song>> SearchForSongAsync(string searchTerm);
        Task<IActionResult> GetSongById(int songId);
        Task<IEnumerable<Artist>> GetArtistsAsync();
        Task<IEnumerable<Album>> GetAlbumsAsync();
        Task<IEnumerable<Song>> GetSongsAsync();
        Task<Artist> GetArtistByIdAsync(int artistId);
        Task<Album> GetAlbumByIdAsync(int albumId);
        Task<IEnumerable<Album>> GetAlbumsOfArtistAsync(int artistId);
        Task<IEnumerable<Song>> GetSongsOfAlbumAsync(int albumId);
    }
}