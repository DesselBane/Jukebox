using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Jukebox.LastFm.Abstractions;
using Jukebox.LastFm.Abstractions.ResponseModels;
using Jukebox.LastFm.Abstractions.Services;
using Newtonsoft.Json.Linq;

namespace Jukebox.LastFm.Services
{
    public class ArtistApi : IArtistApi
    {
        private readonly string           _apiToken;
        private readonly Uri              _lastFmApi;
        private readonly ILastFmScheduler _scheduler;
        private readonly HttpClient       _client;

        public ArtistApi(string apiToken, Uri lastFmApi, ILastFmScheduler scheduler)
        {
            _apiToken  = apiToken;
            _lastFmApi = lastFmApi;
            _scheduler = scheduler;
            _client    = new HttpClient();
        }

        public Task<ArtistFullInfo> GetInfoAsync(string artistName, string lang = null, bool? autocorrect = null)
        {
            var task = new Task<ArtistFullInfo>(() =>
                                                {
                                                    var url = _lastFmApi + BuildQuerryString("artist.getInfo",
                                                                                                           artistName,
                                                                                                           null,
                                                                                                           lang,
                                                                                                           autocorrect);

                                                    var result = _client.GetAsync(url).Result;

                                                    return JObject.Parse(result.Content.ReadAsStringAsync().Result)
                                                                  .SelectToken("artist")
                                                                  .ToObject<ArtistFullInfo>();
                                                });
            
            _scheduler.ScheduleTask(task);
            return task;
        }

        public Task<ArtistFullInfo> GetInfoAsync(Guid mbid, string lang = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<ArtistFullInfo> GetCorrectionAsync(string artistName) => throw new NotImplementedException();

        public Task<ArtistSimilarInfo[]> GetSimilarAsync(string artistName, int? limit = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<ArtistSimilarInfo[]> GetSimilarAsync(Guid mbid, int? limit = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEnumerable<AlbumInfo>> GetTopAlbums(string artistName, int? limit = null, int? page = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEnumerable<AlbumInfo>> GetTopAlbums(Guid mbid, int? limit = null, int? page = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEquatable<ArtistTag>> GetTopTags(string artistName, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEquatable<ArtistTag>> GetTopTags(Guid mbid, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEnumerable<TrackInfo>> GetTopTracks(string artistName, int? limit = null, int? page = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<IEnumerable<TrackInfo>> GetTopTracks(Guid mbid, int? limit = null, int? page = null, bool? autocorrect = null) => throw new NotImplementedException();

        public Task<LastFmSearch> Search(string searchTerm, int? limit = null, int? page = null) => throw new NotImplementedException();

        private string BuildQuerryString(string method,
                                         string artistName  = null,
                                         Guid?  mbid        = null,
                                         string lang        = null,
                                         bool?  autocorrect = null,
                                         int?   page        = null,
                                         int?   limit       = null)
        {
            var stringBuilder = new StringBuilder();

            stringBuilder.Append($"?api_key={_apiToken}&format=json&method={method}");

            if (!string.IsNullOrWhiteSpace(artistName))
                stringBuilder.Append($"&artist={artistName}");
            if (mbid.HasValue)
                stringBuilder.Append($"&mbid={mbid.Value.ToString()}");
            if (!string.IsNullOrWhiteSpace(lang))
                stringBuilder.Append($"&lang={lang}");
            if (autocorrect.HasValue)
                stringBuilder.Append($"&autocorrect={Convert.ToInt32(autocorrect.Value)}");
            if (page.HasValue)
                stringBuilder.Append($"&page={page.Value}");
            if (limit.HasValue)
                stringBuilder.Append($"&limit={limit.Value}");

            return stringBuilder.ToString();
        }
    }
}