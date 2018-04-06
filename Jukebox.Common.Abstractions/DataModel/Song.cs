using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Song
    {
        private string _source;

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

        [DataMember]
        [NotMapped]
        [JsonConverter(typeof(StringEnumConverter))]
        public SongSource SourceType { get; set; } = SongSource.CustomBackend;

        [DataMember]
        [NotMapped]
        public string Source
        {
            get => SourceType == SongSource.CustomBackend ? $"api/song/{Id}" : _source;
            set => _source = value;
        }
    }
}