using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.LastFm.Abstractions.ResponseModels;

namespace Jukebox.LastFm.Abstractions.Services
{
    public interface IArtistApi
    {
        /// <summary>
        /// Queries the last.fm API to get information about an artist by its name or its MBID
        /// </summary>
        /// <param name="artistName">The artist's name</param>
        /// <param name="lang">The language to return the biography in, expressed as an ISO 639 alpha-2 code</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response</param>
        Task<ArtistFullInfo> GetInfoAsync(string artistName, string lang = null, bool? autocorrect = null);
        
        /// <summary>
        /// Queries the last.fm API to get information about an artist by its name or its MBID
        /// </summary>
        /// <param name="mbid">The artist's MusicBrainzID (MBID)</param>
        /// <param name="lang">The language to return the biography in, expressed as an ISO 639 alpha-2 code</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response</param>
        Task<ArtistFullInfo> GetInfoAsync(Guid mbid, string lang = null, bool? autocorrect = null);
        
        /// <summary>
        /// Use the last.fm corrections data to check whether the supplied artist has a correction to a canonical artist
        /// </summary>
        /// <param name="artistName">The artist name to correct.</param>
        Task<ArtistFullInfo> GetCorrectionAsync(string artistName);

        /// <summary>
        /// Get all the artists similar to this artist
        /// </summary>
        /// <param name="artistName">The artist name</param>
        /// <param name="limit">Limit the number of similar artists returned</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<ArtistSimilarInfo[]> GetSimilarAsync(string artistName, int? limit = null, bool? autocorrect = null);
        
        /// <summary>
        /// Get all the artists similar to this artist
        /// </summary>
        /// <param name="mbid">The musicbrainz id for the artist</param>
        /// <param name="limit">Limit the number of similar artists returned</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<ArtistSimilarInfo[]> GetSimilarAsync(Guid mbid , int? limit = null, bool? autocorrect = null);

        /// <summary>
        /// Get the top albums for an artist on Last.fm, ordered by popularity.
        /// </summary>
        /// <param name="artistName">The artist name</param>
        /// <param name="limit">The number of results to fetch per page. Defaults to 50.</param>
        /// <param name="page">The page number to fetch. Defaults to first page.</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<IEnumerable<AlbumInfo>> GetTopAlbums(string artistName, int? limit = null, int? page = null, bool? autocorrect = null);
        
        /// <summary>
        /// Get the top albums for an artist on Last.fm, ordered by popularity.
        /// </summary>
        /// <param name="mbid">The musicbrainz id for the artist</param>
        /// <param name="limit">The number of results to fetch per page. Defaults to 50.</param>
        /// <param name="page">The page number to fetch. Defaults to first page.</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<IEnumerable<AlbumInfo>> GetTopAlbums(Guid mbid, int? limit = null, int? page = null, bool? autocorrect = null);

        /// <summary>
        /// Get the top tags for an artist on Last.fm, ordered by popularity.
        /// </summary>
        /// <param name="artistName">The artist name</param>
        /// <param name="autocorrect"></param>
        Task<IEquatable<ArtistTag>> GetTopTags(string artistName, bool? autocorrect = null);
        
        /// <summary>
        /// Get the top tags for an artist on Last.fm, ordered by popularity.
        /// </summary>
        /// <param name="mbid">The musicbrainz id for the artist</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<IEquatable<ArtistTag>> GetTopTags(Guid mbid, bool? autocorrect = null);

        /// <summary>
        /// Get the top tracks by an artist on Last.fm, ordered by popularity
        /// </summary>
        /// <param name="artistName">The artist name</param>
        /// <param name="limit">The number of results to fetch per page. Defaults to 50.</param>
        /// <param name="page">The page number to fetch. Defaults to first page.</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<IEnumerable<TrackInfo>> GetTopTracks(string artistName, int? limit = null, int? page = null, bool? autocorrect = null);
        
        /// <summary>
        /// Get the top tracks by an artist on Last.fm, ordered by popularity
        /// </summary>
        /// <param name="mbid">The musicbrainz id for the artist</param>
        /// <param name="limit">The number of results to fetch per page. Defaults to 50.</param>
        /// <param name="page">The page number to fetch. Defaults to first page.</param>
        /// <param name="autocorrect">Transform misspelled artist names into correct artist names, returning the correct version instead. The corrected artist name will be returned in the response.</param>
        Task<IEnumerable<TrackInfo>> GetTopTracks(Guid mbid, int? limit = null, int? page = null, bool? autocorrect = null);

        /// <summary>
        /// Search for an artist by name. Returns artist matches sorted by relevance.
        /// </summary>
        /// <param name="searchTerm">The artist name</param>
        /// <param name="limit">The number of results to fetch per page. Defaults to 30.</param>
        /// <param name="page">The page number to fetch. Defaults to first page.</param>
        /// <returns></returns>
        Task<LastFmSearch> Search(string searchTerm, int? limit = null, int? page = null);
    }
}