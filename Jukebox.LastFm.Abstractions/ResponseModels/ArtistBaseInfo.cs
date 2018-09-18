using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ArtistBaseInfo
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        
        [DataMember(Name = "mbid", IsRequired = false)]
        public Guid? Mbid { get; set; }
        
        [DataMember(Name = "url")]
        public Uri Url { get; set; }
        
        [DataMember(Name = "streamable")]
        [JsonConverter(typeof(IntToBooleanConverter))]
        public bool Streamable { get; set; }
        
        [DataMember(Name = "image")]
        public List<ImageInfo> ImageInfos { get; set; }

    }
}