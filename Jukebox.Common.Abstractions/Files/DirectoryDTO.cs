using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Jukebox.Common.Abstractions.Files
{
    [DataContract]
    public class DirectoryDTO
    {
        [DataMember]
        public string DirectoryName { get; set; }
        [DataMember]
        public string DirectoryFullPath { get; set; }

        [DataMember]
        [JsonConverter(typeof(StringEnumConverter))]
        public DirectoryTypes Type { get; set; } = DirectoryTypes.Normal;
    }
}