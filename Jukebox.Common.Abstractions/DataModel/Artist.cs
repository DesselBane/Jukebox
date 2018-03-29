using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Artist
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int Id { get; set; }

        public List<Album> Albums { get; set; }
    }
}