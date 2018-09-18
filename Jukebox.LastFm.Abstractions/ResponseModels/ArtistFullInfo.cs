using System.Collections.Generic;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ArtistFullInfo : ArtistBaseInfo
    {
        [DataMember(Name = "ontour")]
        [JsonConverter(typeof(IntToBooleanConverter))]
        public bool OnTour{ get; set; }
        
        [DataMember(Name = "stats")]
        public ArtistStatistics Statistics { get; set; }
        
        [DataMember(Name = "similar")]
        [JsonConverter(typeof(SelectSubTokenConverter),"artist")]
        public List<ArtistBaseInfo> Similars { get; set; }
        
        [DataMember(Name = "tags")]
        [JsonConverter(typeof(SelectSubTokenConverter),"tag")]
        public List<ArtistTag> Tags { get; set; }
        
        [DataMember(Name = "bio")]
        public ArtistBiography Biography { get; set; }
    }
}