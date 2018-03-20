using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public sealed class PlayerCommand
    {
        [DataMember]
        [JsonConverter(typeof(StringEnumConverter))]
        public PlayerCommandTypes Type { get; set; }

        [DataMember]
        public List<string[]> Arguments { get; set; } = new List<string[]>();

        public PlayerCommand()
        {
            
        }

        public PlayerCommand(PlayerCommandTypes cmdType, List<string[]> arguments = null)
        {
            Type = cmdType;
            Arguments = arguments ?? new List<string[]>();
        }
        
    }
}