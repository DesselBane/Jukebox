using System;
using System.Runtime.Serialization;

namespace Infrastructure.Security
{
    [DataContract]
    public sealed class AuthToken
    {
        [DataMember]
        public string AccessToken { get; set; }
        [DataMember]
        public string RefreshToken { get; set; }
        [DataMember]
        public DateTime AccessToken_ValidUntil { get; set; }
        [DataMember]
        public DateTime RefreshToken_ValidUntil { get; set; }
    }
}