using System.IO;
using System.Threading.Tasks;
using Castle.Core.Configuration;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Settings;
using Jukebox.Common.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Jukebox.Common.Settings
{
    public class SettingsService : ISettingsService
    {
        private readonly IHostingEnvironment _environment;
        private readonly IOptions<IndexOptions> _indexOptions;
        private readonly string _filePath;

        public SettingsService(IHostingEnvironment environment, IOptions<IndexOptions> indexOptions)
        {
            _environment = environment;
            _indexOptions = indexOptions;
            _filePath = _environment.ContentRootPath + "/appsettings.json";
        }

        public async Task UpdateMusicPaths(string[] musicPaths)
        {
            var appsettingsFileString = File.ReadAllText(_filePath);
            var appsettingsObj = JObject.Parse(appsettingsFileString);

            var array = (JArray) appsettingsObj["Index"]["IndexingPaths"];
            array.Clear();
            array.Add(musicPaths);

            File.Delete(_filePath);
            var file = File.Create(_filePath);
            var fw = new StreamWriter(file);
            await fw.WriteAsync(appsettingsObj.ToJsonString());
            await fw.FlushAsync();
            fw.Dispose();
            file.Dispose();
        }

        public Task<string[]> GetMusicPaths()
        {
            return Task.FromResult(_indexOptions.Value.IndexingPaths);
        }
    }
}