using System;
using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ArtistTag
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        
        [DataMember(Name = "url")]
        public Uri Url { get; set; }
        
        [DataMember(Name = "count", IsRequired = false)]
        public int Count { get; set; }
    }
}