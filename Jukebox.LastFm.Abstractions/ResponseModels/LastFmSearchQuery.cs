using System.Runtime.Serialization;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [DataContract]
    public class LastFmSearchQuery
    {
        [DataMember(Name = "#text")]
        public string Text { get; set; }
        
        [DataMember(Name = "role")]
        public string Role { get; set; }
        
        [DataMember(Name = "searchTerms")]
        public string SearchTerms { get; set; }
        
        [DataMember(Name = "startPage")]
        public int StartPage { get; set; }
    }
}