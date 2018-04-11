using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.Files
{
    [DataContract]
    public class DirectoryDTO
    {
        [DataMember]
        public string DirectoryName { get; set; }
        [DataMember]
        public string DirectoryFullPath { get; set; }
    }
}