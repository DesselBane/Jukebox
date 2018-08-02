public static IWebHost BuildWebHost(string[] args)
{
    return WebHost.CreateDefaultBuilder(args)
                  .UseUrls("http://0.0.0.0:5000")
                  .UseStartup<Startup>()
                  .Build();
}
