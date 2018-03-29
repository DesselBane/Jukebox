using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Common.Songs
{
    public class SongService : ISongService
    {
        private readonly DataContext _dataContext;

        public SongService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Song>> SearchForSongAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<Song>();

            searchTerm = searchTerm.ToLower();

            return await _dataContext.Songs
                                     .Where(x => x.FilePath.ToLower().Contains(searchTerm) ||
                                                 x.Title.ToLower().Contains(searchTerm))
                                     .OrderBy(x => x.Title)
                                     .ToListAsync();
        }

        public async Task<IActionResult> GetSongById(int songId)
        {
            var song = await _dataContext.Songs.FirstOrDefaultAsync(x => x.Id == songId);
            return new FileStreamResult(File.OpenRead(song.FilePath), "audio/mp3");
        }

        public async Task<IEnumerable<Artist>> GetArtistsAsync()
        {
            return await _dataContext.Artists.ToListAsync();
        }

        public async Task<IEnumerable<Album>> GetAlbumsAsync()
        {
            return await _dataContext.Albums.ToListAsync();
        }

        public async Task<IEnumerable<Song>> GetSongsAsync()
        {
            return await _dataContext.Songs.ToListAsync();
        }
    }
}