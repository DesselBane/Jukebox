using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class TrackInfo
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        
        [DataMember(Name = "playcount")]
        public int PlayCount { get; set; }
        
        [DataMember(Name = "listeners")]
        public int Listeners { get; set; }
        
        [DataMember(Name = "mbid")]
        public Guid? Mbid { get; set; }
        
        [DataMember(Name = "url")]
        public Uri Url { get; set; }
        
        [DataMember(Name = "streamable")]
        [JsonConverter(typeof(IntToBooleanConverter))]
        public bool IsStreamable { get; set; }
        
        [DataMember(Name = "artist")]
        public ArtistBaseInfo ArtistBaseInfo { get; set; }
        
        [DataMember(Name = "image")]
        public List<ImageInfo> ImageInfos { get; set; }
        
        [DataMember(Name = "@attr")]
        [JsonConverter(typeof(SelectSubTokenConverter),"rank")]
        public int Rank { get; set; }
    }
}