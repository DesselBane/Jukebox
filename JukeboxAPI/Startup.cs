using System;
using System.Reflection;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSwag.AspNetCore;
using SPAMiddleware;

namespace Jukebox
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public virtual IServiceProvider ConfigureServices(IServiceCollection services)
        {
            return services.ConfigureJukebox(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app,
                                      IHostingEnvironment env,
                                      ILoggerFactory      loggerFactory)
        {
            app.ApplicationServices.GetService<DataContext>().Database.Migrate();

            app.UseExceptionMiddleware();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
 
            app.UseSwaggerUi3(typeof(Startup).GetTypeInfo().Assembly);

            app.UseAuthentication();

            app.UseSpaMiddleware();

            var websocketOptions = app.ApplicationServices.GetService<IOptions<WebsocketOptions>>().Value;

            app.UseWebSockets(new WebSocketOptions
                              {
                                  KeepAliveInterval = websocketOptions.KeepAliveInterval,
                                  ReceiveBufferSize = websocketOptions.BufferSize
                              });

            app.UseMvc();
            app.UseStaticFiles();
        }
    }
}