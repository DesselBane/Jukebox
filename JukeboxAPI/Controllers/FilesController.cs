using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class FilesController
    {
        [HttpGet("info")]
        [AllowAnonymous]
        public async Task GetDirectoryInfo([FromQuery] string path)
        {
            var info = DriveInfo.GetDrives();
        }
    }
}