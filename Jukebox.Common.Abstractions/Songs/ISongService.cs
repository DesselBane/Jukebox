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
    }
}