using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;

namespace Jukebox.Common.Abstractions.Songs
{
    public interface ISongSearchService
    {
        Task<IEnumerable<Song>> SearchForSongAsync(string searchTerm);
    }
}