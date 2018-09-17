using System;
using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class LastFmLink
    {
        [DataMember(Name = "#text")]
        public string Name { get; set; }
        
        [DataMember(Name = "rel")]
        public string Rel { get; set; }
        
        [DataMember(Name = "href")]
        public Uri Href { get; set; }
    }
}