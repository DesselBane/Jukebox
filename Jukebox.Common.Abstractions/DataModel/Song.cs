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
        public int      Id              { get; set; }
        public string   FilePath        { get; set; }
        [DataMember]
        public string   Title           { get; set; }
        [DataMember]
        public string   Album           { get; set; }
        public DateTime LastTimeIndexed { get; set; }

        public string ArtistsDb
        {
            get => string.Join("§$%&", Artists);
            protected set => Artists = new List<string>(value.Split(new[] {"§$%&"}, StringSplitOptions.RemoveEmptyEntries));
        }

        [NotMapped]
        [DataMember]
        public List<string> Artists { get; protected set; } = new List<string>();
    }
}