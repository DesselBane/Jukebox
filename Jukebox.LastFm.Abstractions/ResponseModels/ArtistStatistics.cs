using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]    
    public class ArtistStatistics
    {
        [DataMember(Name = "listeners")]
        public int Listeners { get; set; }
        
        [DataMember(Name = "playcount")]
        public int Playcount { get; set; }
    }
}