using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Jukebox.LastFm.Abstractions.ResponseModels
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ImageSize
    {
        [EnumMember(Value = "small")]
        Small,
        [EnumMember(Value = "medium")]
        Medium,
        [EnumMember(Value = "large")]
        Large,
        [EnumMember(Value = "extralarge")]
        ExtraLarge,
        [EnumMember(Value = "mega")]
        Mega,
        [EnumMember(Value = "")]
        Undifiened
    }
}