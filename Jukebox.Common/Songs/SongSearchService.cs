using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Common.Songs
{
    public class SongSearchService : ISongSearchService
    {
        private readonly DataContext _dataContext;

        public SongSearchService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        
        public async Task<IEnumerable<Song>> SearchForSongAsync(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();

            return await _dataContext.Songs
                                     .Where(x => x.Album.ToLower().Contains(searchTerm) ||
                                                 x.ArtistsDb.ToLower().Contains(searchTerm) ||
                                                 x.FilePath.ToLower().Contains(searchTerm) ||
                                                 x.Title.ToLower().Contains(searchTerm))
                                     .OrderBy(x => x.Title)
                                     .ToListAsync();
        }
    }
}