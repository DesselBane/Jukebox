using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class SongController : Controller
    {
        private readonly IIndexingService _indexingService;
        private readonly ISongService _songService;

        public SongController(IIndexingService indexingService, ISongService songService)
        {
            _indexingService = indexingService;
            _songService = songService;
        }

        [HttpPost("index")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(void), Description = "Indexing Worked")]
        [SwaggerResponse(208, typeof(ExceptionDTO), Description = SongErrorCodes.INDEX_OPERATION_ALREADY_RUNNING + "\nIndexing operation already running")]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = SongErrorCodes.NO_PERMISSION_TO_START_INDEXING + "\nUser donst have permission")]
        public Task StartIndexing()
        {
            return _indexingService.IndexSongsAsync();
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(IEnumerable<Song>))]
        public Task<IEnumerable<Song>> SearchForSong([FromQuery] string searchTerm)
        {
            return _songService.SearchForSongAsync(searchTerm);
        }

        [HttpGet("{songId}")]
        [SwaggerResponse(HttpStatusCode.OK,typeof(byte[]))]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = SongErrorCodes.SONG_NOT_FOUND + "\nSong not found")]
        public Task<IActionResult> GetSongById(int songId)
        {
            return _songService.GetSongById(songId);
        }

        [HttpGet("artists")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(IEnumerable<string>), Description = "All available Artists")]
        public Task<IEnumerable<Artist>> GetArtists()
        {
            return _songService.GetArtistsAsync();
        }

        [HttpGet("artists/{artistId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(Artist), Description = "Artist with the specified Id")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = SongErrorCodes.ARTIST_NOT_FOUND + "\nArtist could not be found")]
        public Task<Artist> GetArtistById(int artistId)
        {
            return _songService.GetArtistByIdAsync(artistId);
        }

        [HttpGet("albums/ofArtist/{artistId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(IEnumerable<Album>), Description = "All Albums by the specified Artist")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = SongErrorCodes.ARTIST_NOT_FOUND + "\n Artist could not be found")]
        public Task<IEnumerable<Album>> GetAlbumsOfArtist(int artistId)
        {
            return _songService.GetAlbumsOfArtistAsync(artistId);
        }

        [HttpGet("albums")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(IEnumerable<Album>), Description = "Returns all Albums")]
        public Task<IEnumerable<Album>> GetAlbums()
        {
            return _songService.GetAlbumsAsync();
        }

        [HttpGet("albums/{albumId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Album), Description              = "Album with specified Id")]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ExceptionDTO), Description = SongErrorCodes.ALBUM_NOT_FOUND + "\nAlbum could not be found")]
        public Task<Album> GetAlbumById(int albumId)
        {
            return _songService.GetAlbumByIdAsync(albumId);
        }

        [HttpGet("songs")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK, typeof(IEnumerable<Song>), Description = "Returns all Songs")]
        public Task<IEnumerable<Song>> GetSongs()
        {
            return _songService.GetSongsAsync();
        }

        [HttpGet("songs/ofAlbum/{albumId}")]
        [AllowAnonymous]
        [SwaggerResponse(HttpStatusCode.OK,typeof(IEnumerable<Song>), Description = "All Songs from the specified Album")]
        [SwaggerResponse(HttpStatusCode.NotFound,typeof(ExceptionDTO), Description = "Album could not be found")]
        public Task<IEnumerable<Song>> GetSongsOfAlbum(int albumId)
        {
            return _songService.GetSongsOfAlbumAsync(albumId);
        }
    }
}