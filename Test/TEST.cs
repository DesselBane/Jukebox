using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Jukebox.LastFm.Abstractions.ResponseModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Test
{
    public class TEST
    {
        public static void TestApi()
        {
            var client = new HttpClient();
            var response = client.GetAsync("http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=ea4a51aa565c0eb2c5cf7731cfad7627&format=json&artist=Nightwish").Result;
            var content = response.Content.ReadAsStringAsync().Result;
            var artist = JObject.Parse(content)
                                .SelectToken("artist")
                                .ToObject<ArtistInfo>();

            Console.WriteLine(JsonConvert.SerializeObject(artist, Formatting.Indented));
            
            Console.ReadKey();

        }
    }
}