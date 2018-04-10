using System.Threading.Tasks;

namespace Jukebox.Common.Abstractions.Settings
{
    public interface ISettingsService
    {
        Task UpdateMusicPaths(string[] musicPaths);
        Task<string[]> GetMusicPaths();
    }
}