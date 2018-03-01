using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using TagLibFile = TagLib.File;

namespace Jukebox.Common.Songs
{
    public class IndexingService : IIndexingService
    {
        private readonly DataContext _dataContext;
        private readonly IndexOptions _indexOptions;

        private static bool _IS_INDEXING = false;
        private static readonly object _IS_INDEXING_SYNC_HANDLE = new object();

        public IndexingService(DataContext dataContext, IOptions<IndexOptions> indexOptions)
        {
            _dataContext = dataContext;
            _indexOptions = indexOptions.Value;
            
        }

        public async Task IndexSongsAsync()
        {
            lock (_IS_INDEXING_SYNC_HANDLE)
            {
                if(_IS_INDEXING)
                    throw new AlreadyReportedException("Indexing already running",Guid.Parse(SongErrorCodes.INDEX_OPERATION_ALREADY_RUNNING));

                _IS_INDEXING = true;
            }

            var indexingStart = DateTime.UtcNow;
            
            foreach (var indexingPath in _indexOptions.IndexingPaths)
            {
                await IndexDirectory(new PhysicalFileProvider(indexingPath),indexingStart);
            }

            _dataContext.Songs.RemoveRange(await _dataContext.Songs
                                                             .Where(x => x.LastTimeIndexed < indexingStart)
                                                             .ToListAsync());
            await _dataContext.SaveChangesAsync();
            
            
            lock (_IS_INDEXING_SYNC_HANDLE)
            {
                _IS_INDEXING = false;
            }
        }

        private async Task IndexDirectory(IFileProvider fileProvider, DateTime indexingStart)
        {
            foreach (var directoryContent in fileProvider.GetDirectoryContents(""))
            {
                if (directoryContent.IsDirectory)
                    await IndexDirectory(new PhysicalFileProvider(directoryContent.PhysicalPath),indexingStart);

                var info = new FileInfo(directoryContent.PhysicalPath);

                if (info.Extension != ".mp3")
                    continue;

                TagLibFile tagLibFile;
                
                try
                {
                     tagLibFile = TagLibFile.Create(directoryContent.PhysicalPath);
                }
                catch (Exception e)
                {
                    continue;
                }

                var song = await _dataContext.Songs.FirstOrDefaultAsync(x => x.FilePath == info.FullName);

                if (song == null)
                {
                    song = new Song();
                    _dataContext.Songs.Add(song);
                }

                song.FilePath = info.FullName;
                song.Title    = tagLibFile.Tag.Title;
                song.Album    = tagLibFile.Tag.Album;

                foreach (var artist in tagLibFile.Tag.Artists)
                {
                    if(!song.Artists.Contains(artist))
                        song.Artists.Add(artist);
                }
                
                song.LastTimeIndexed = indexingStart;
                await _dataContext.SaveChangesAsync();
            }
        }
        
        
    }
}