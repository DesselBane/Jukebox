using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class AlbumInfo
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }
        
        [DataMember(Name = "mbid")]
        public Guid? Mbid { get; set; }
        
        [DataMember(Name = "playcount")]
        public int PlayCount { get; set; }
        
        [DataMember(Name = "url")]
        public Uri Url { get; set; }
        
        [DataMember(Name = "artist")]
        public ArtistBaseInfo ArtistBaseInfo { get; set; }
        
        [DataMember(Name = "image")]
        public List<ImageInfo> ImageInfos { get; set; }
    }
}