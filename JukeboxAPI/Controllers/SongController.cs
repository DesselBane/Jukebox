using System.IO;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class SongController : Controller
    {
        private readonly DataContext _dataContext;

        public SongController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [AllowAnonymous]
        [HttpPost("index")]
        public Task StartIndexing()
        {
            var filePath = "C:\\Workspace\\Music";
            var fileProvider = new PhysicalFileProvider(filePath);
            return IndexDirectory(fileProvider);
        }


        private async Task IndexDirectory(IFileProvider fileProvider)
        {
            foreach (var directoryContent in fileProvider.GetDirectoryContents(""))
            {
                if (directoryContent.IsDirectory)
                    await IndexDirectory(new PhysicalFileProvider(directoryContent.PhysicalPath));

                var info = new FileInfo(directoryContent.PhysicalPath);
                var tagLibFile = TagLib.File.Create(directoryContent.PhysicalPath);
                
                if (info.Extension != ".mp3") 
                    continue;
                
                var song =  await _dataContext.Songs.FirstOrDefaultAsync(x => x.FilePath == info.FullName);

                if (song != null) 
                    continue;
                
                song = new Song();
                _dataContext.Songs.Add(song);
                song.FilePath = info.FullName;
                song.Title = tagLibFile.Tag.Title;
                song.Album = tagLibFile.Tag.Album;
                song.Artists.AddRange(tagLibFile.Tag.Artists);
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}