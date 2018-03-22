using Newtonsoft.Json;

namespace Jukebox.Common.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToJsonString(this object data)
        {
            var settings = new JsonSerializerSettings
                           {
                               ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                           };
            
            return JsonConvert.SerializeObject(data, Formatting.Indented, settings);
        }
    }
}