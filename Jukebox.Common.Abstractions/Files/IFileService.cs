using System.Collections.Generic;
using System.Threading.Tasks;

namespace Jukebox.Common.Abstractions.Files
{
    public interface IFileService
    {
        Task<IEnumerable<DirectoryDTO>> GetDirectoryInfoAsync(string path);
    }
}