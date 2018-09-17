using System;
using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ImageInfo
    {
        [DataMember(Name = "#text")]
        public Uri ImageLocation { get; set; }
        
        [DataMember(Name = "size")]
        public ImageSize Size { get; set; }
    }
}