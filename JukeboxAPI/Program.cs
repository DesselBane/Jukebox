﻿using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Jukebox
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                          .UseUrls("http://0.0.0.0:5000")
                          .UseStartup<Startup>()
                          .Build();
        }
    }
}