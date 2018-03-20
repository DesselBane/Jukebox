using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

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
        [JsonConverter(typeof(StringEnumConverter))]
        public PlayerState State { get; set; }

        [DataMember]
        public List<Song> Playlist { get; set; } = new List<Song>();

        [DataMember]
        public int PlaylistIndex { get; set; }
    }
}