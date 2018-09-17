using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract(Name = "artist")]
    public class ArtistInfo
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        
        [DataMember(Name = "mbid", IsRequired = false)]
        public Guid? Mbid { get; set; }
        
        [DataMember(Name = "url")]
        public Uri Url { get; set; }
        
        [DataMember(Name = "image")]
        public List<ImageInfo> ImageInfos { get; set; }
        
        [DataMember(Name = "streamable")]
        [JsonConverter(typeof(IntToBooleanConverter))]
        public bool Streamable { get; set; }
        
        [DataMember(Name = "ontour")]
        [JsonConverter(typeof(IntToBooleanConverter))]
        public bool OnTour{ get; set; }
        
        
        [DataMember(Name = "stats")]
        public ArtistStatistics Statistics { get; set; }
        
        [DataMember(Name = "similar")]
        [JsonConverter(typeof(SelectSubTokenConverter),"artist")]
        public List<ArtistInfo> Similars { get; set; }
        
        [DataMember(Name = "tags")]
        [JsonConverter(typeof(SelectSubTokenConverter),"tag")]
        public List<ArtistTag> Tags { get; set; }
        
        [DataMember(Name = "bio")]
        public ArtistBiography Biography { get; set; }
    }
}