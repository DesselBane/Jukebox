using System;
using System.Reflection;
using ExceptionMiddleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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
        public virtual void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseExceptionMiddleware();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwaggerUi3(typeof(Startup).GetTypeInfo().Assembly, new SwaggerUi3Settings());

            app.UseSpaMiddleware();
            
            app.UseMvc();
            app.UseStaticFiles();
        }
    }
}