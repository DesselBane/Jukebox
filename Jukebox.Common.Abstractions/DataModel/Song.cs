using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Song
    {
        [DataMember]
        public int Id { get; set; }

        public string FilePath { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public int AlbumId { get; set; }

        [DataMember]
        public Album Album { get; set; }
        
        
        public DateTime LastTimeIndexed { get; set; }

        
    }
}