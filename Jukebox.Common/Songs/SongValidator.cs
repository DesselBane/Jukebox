using System;
using System.Linq;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;

namespace Jukebox.Common.Songs
{
    public class SongValidator
    {
        private readonly DataContext _dataContext;

        public SongValidator(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public void ValidateSongExists(int songId)
        {
            if(!_dataContext.Songs.Any(x => x.Id == songId))
                throw new NotFoundException(songId,nameof(Song), Guid.Parse(SongErrorCodes.SONG_NOT_FOUND));
        }

        public void ValidateArtistExists(int artistId)
        {
            if(!_dataContext.Artists.Any(x => x.Id == artistId))
                throw new NotFoundException(artistId,nameof(Artist),Guid.Parse(SongErrorCodes.ARTIST_NOT_FOUND));
        }

        public void ValidateAlbumExists(int albumId)
        {
            if(!_dataContext.Albums.Any(x => x.Id == albumId))
                throw new NotFoundException(albumId,nameof(Album),Guid.Parse(SongErrorCodes.ALBUM_NOT_FOUND));
        }
    }
}