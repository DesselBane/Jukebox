using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukebox.Common.Abstractions.DataModel
{
    public class Song
    {
        public int    Id       { get; set; }
        public string FilePath { get; set; }
        public string Title    { get; set; }

        public string Album { get; set; }

        public string ArtistsDb
        {
            get => string.Join("§$%&", Artists);
            protected set => Artists = new List<string>(value.Split(new[] {"§$%&"}, StringSplitOptions.RemoveEmptyEntries));
        }

        [NotMapped]
        public List<string> Artists { get; protected set; } = new List<string>();
    }
}