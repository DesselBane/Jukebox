using System;
using System.Runtime.Serialization;
using JsonConverters;
using Newtonsoft.Json;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ArtistBiography
    {
        [DataMember(Name = "links")]
        [JsonConverter(typeof(SelectSubTokenConverter),"link")]
        public LastFmLink Link { get; set; }
        
        [DataMember(Name = "published")]
        public DateTime Published { get; set; }
        
        [DataMember(Name = "summary")]
        public string Summary { get; set; }
        
        [DataMember(Name = "content")]
        public string Content { get; set; }
    }
}