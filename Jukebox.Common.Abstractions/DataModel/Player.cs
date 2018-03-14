using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Player
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string Name { get; set; }
        
        [DataMember]
        public bool IsPlaying { get; set; }

        [DataMember]
        public List<Song> Playlist { get; set; } = new List<Song>();

        [DataMember]
        public int PlaylistIndex { get; set; }
    }
}