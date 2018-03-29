using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Album
    {
        [DataMember]
        public int ArtistId { get; set; }
        
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public Artist Artist { get; set; }

        public List<Song> Songs { get; set; }
    }
}