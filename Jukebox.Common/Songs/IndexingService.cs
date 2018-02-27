using System;
using System.IO;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using File = TagLib.File;

namespace Jukebox.Common.Songs
{
    public class IndexingService : IIndexingService
    {
        private readonly DataContext _dataContext;

        public IndexingService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public Task IndexSongsAsync() => throw new NotImplementedException();

        private async Task IndexDirectory(IFileProvider fileProvider)
        {
            foreach (var directoryContent in fileProvider.GetDirectoryContents(""))
            {
                if (directoryContent.IsDirectory)
                    await IndexDirectory(new PhysicalFileProvider(directoryContent.PhysicalPath));

                var info = new FileInfo(directoryContent.PhysicalPath);

                if (info.Extension != ".mp3")
                    continue;

                var tagLibFile = File.Create(directoryContent.PhysicalPath);

                var song = await _dataContext.Songs.FirstOrDefaultAsync(x => x.FilePath == info.FullName);

                if (song != null)
                    continue;

                song = new Song();
                _dataContext.Songs.Add(song);
                song.FilePath = info.FullName;
                song.Title    = tagLibFile.Tag.Title;
                song.Album    = tagLibFile.Tag.Album;
                song.Artists.AddRange(tagLibFile.Tag.Artists);
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}