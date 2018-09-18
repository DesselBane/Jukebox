using System.Collections.Generic;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class LastFmSearch
    {
        [DataMember(Name = "opensearch:Query")]
        public LastFmSearchQuery LastFmSearchQuery { get; set; }
        
        [DataMember(Name = "opensearch:totalResults")]
        public int TotalResults { get; set; }
        
        [DataMember(Name = "opensearch:startIndex")]
        public int StartIndex { get; set; }
        
        [DataMember(Name = "opensearch:itemsPerPage")]
        public int ItemsPerPage { get; set; }
        
        [DataMember(Name = "artistmatches")]
        [JsonConverter(typeof(SelectSubTokenConverter),"artist")]
        public List<ArtistBaseInfo> ArtistBaseInfos { get; set; }
    }
}