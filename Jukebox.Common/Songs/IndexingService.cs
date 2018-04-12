using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
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
        private static bool _IS_INDEXING;
        private static readonly object _IS_INDEXING_SYNC_HANDLE = new object();
        private readonly DataContext _dataContext;
        private readonly IndexOptions _indexOptions;

        public IndexingService(DataContext dataContext, IOptionsMonitor<IndexOptions> indexOptions)
        {
            _dataContext = dataContext;
            _indexOptions = indexOptions.CurrentValue;
        }

        public async Task IndexSongsAsync()
        {
            lock (_IS_INDEXING_SYNC_HANDLE)
            {
                if (_IS_INDEXING)
                    throw new AlreadyReportedException("Indexing already running", Guid.Parse(SongErrorCodes.INDEX_OPERATION_ALREADY_RUNNING));

                _IS_INDEXING = true;
            }

            var indexingStart = DateTime.UtcNow;

            foreach (var indexingPath in _indexOptions.IndexingPaths)
                await IndexDirectory(new PhysicalFileProvider(indexingPath), indexingStart);

            _dataContext.Songs.RemoveRange(await _dataContext.Songs
                                                             .Where(x => x.LastTimeIndexed < indexingStart)
                                                             .ToListAsync());
            await _dataContext.SaveChangesAsync();

            var orphanedAlbums = await _dataContext.Albums
                                                   .GroupJoin(_dataContext.Songs, album => album.Id, song => song.AlbumId, (album,
                                                                                                                            song) => new {album, song})
                                                   .Where(x => x.song == null || !x.song.Any())
                                                   .Select(x => x.album)
                                                   .ToListAsync();

            _dataContext.Albums.RemoveRange(orphanedAlbums);
            await _dataContext.SaveChangesAsync();

            var orphanedArtists = await _dataContext.Artists
                                                    .GroupJoin(_dataContext.Albums, artist => artist.Id, album => album.ArtistId, (artist,
                                                                                                                                   album) => new {artist, album})
                                                    .Where(x => x.album == null || !x.album.Any())
                                                    .Select(x => x.artist)
                                                    .ToListAsync();
            
            _dataContext.Artists.RemoveRange(orphanedArtists);
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
                    await IndexDirectory(new PhysicalFileProvider(directoryContent.PhysicalPath), indexingStart);

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

                var artistsName = tagLibFile.Tag.Performers.Length > 0 ? tagLibFile.Tag.Performers[0] : "Unknown Artist";
                var songArtist = await _dataContext.Artists.FirstOrDefaultAsync(x => x.Name == artistsName);

                if (songArtist == null)
                {
                    songArtist = new Artist
                    {
                        Name = artistsName
                    };

                    _dataContext.Artists.Add(songArtist);
                }

                var songAlbum = await _dataContext.Albums.FirstOrDefaultAsync(x => x.Name == tagLibFile.Tag.Album);

                if (songAlbum == null)
                {
                    songAlbum = new Album
                                {
                                    Name = tagLibFile.Tag.Album,
                                    ArtistId = songArtist.Id
                                };
                    
                    _dataContext.Albums.Add(songAlbum);

                }
                                

                song.FilePath = info.FullName;
                song.Title = tagLibFile.Tag.Title;
                song.AlbumId = songAlbum.Id;

                song.Album = await _dataContext.Albums.FirstOrDefaultAsync(x => x.Name == tagLibFile.Tag.Album);

               
              
                song.LastTimeIndexed = indexingStart;
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}