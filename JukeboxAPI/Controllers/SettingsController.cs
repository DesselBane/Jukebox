using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Settings;
using Microsoft.AspNetCore.Mvc;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class SettingsController
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }
        
        [HttpPost("musicPaths")]
        public Task UpdateMusicPaths([FromBody] string[] paths)
        {
            return _settingsService.UpdateMusicPaths(paths);
        }

        [HttpGet("musicPaths")]
        public Task<string[]> GetMusicPaths()
        {
            return _settingsService.GetMusicPaths();
        }
    }
}