using Newtonsoft.Json;

namespace Jukebox.Common.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToJsonString(this object data)
        {
            return JsonConvert.SerializeObject(data);
        }
    }
}