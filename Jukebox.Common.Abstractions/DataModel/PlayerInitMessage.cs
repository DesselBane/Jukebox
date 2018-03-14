using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class PlayerInitMessage
    {
        [DataMember]
        public string PlayerName { get; set; }
        
        [DataMember]
        public string AccessToken { get; set; }
    }
}