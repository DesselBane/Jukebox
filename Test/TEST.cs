using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Jukebox.LastFm;
using Jukebox.LastFm.Abstractions.ResponseModels;
using Jukebox.LastFm.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Test
{
    public class TEST
    {
        public static void TestApi()
        {
            var artistApi = new ArtistApi("ea4a51aa565c0eb2c5cf7731cfad7627", new Uri("http://ws.audioscrobbler.com/2.0/"), new LastFmScheduler(TimeSpan.FromMilliseconds(1200)));

            var artist = artistApi.GetInfoAsync("nightwish").Result;
            
            Console.ReadKey();

        }
    }
}