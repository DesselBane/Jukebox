using System;
using System.Runtime.Serialization;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class Player
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string Name { get; set; }
    }
}