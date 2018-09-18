using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class ArtistSimilarInfo : ArtistBaseInfo
    {
        [DataMember(Name = "match")]
        public float Match { get; set; }
    }
}