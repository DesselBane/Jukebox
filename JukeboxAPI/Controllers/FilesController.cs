using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Files;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class FilesController
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }
        
        [HttpGet("info")]
        public Task<IEnumerable<DirectoryDTO>> GetDirectoryInfo([FromQuery] string path)
        {
            return _fileService.GetDirectoryInfoAsync(path);
        }
    }
}