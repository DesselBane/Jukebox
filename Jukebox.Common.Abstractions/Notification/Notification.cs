using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Jukebox.Common.Abstractions.Notification
{
    [DataContract]
    public sealed class Notification
    {
        [DataMember]
        [JsonConverter(typeof(StringEnumConverter))]
        public NotificationChannel Channel { get; set; }
        
        [DataMember]
        public List<string[]> Arguments { get; set; } = new List<string[]>();

        public Notification()
        {
            
        }

        public Notification(NotificationChannel channel, params string[][] args)
        {
            Channel = channel;
            Arguments.AddRange(args);
        }
        
    }
    
    
}