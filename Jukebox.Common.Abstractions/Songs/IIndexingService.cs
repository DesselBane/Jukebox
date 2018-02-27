using System.Threading.Tasks;

namespace Jukebox.Common.Abstractions.Songs
{
    public interface IIndexingService
    {
        Task IndexSongsAsync();
    }
}