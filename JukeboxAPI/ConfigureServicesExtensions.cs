using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Autofac.Extras.DynamicProxy;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Security;
using Microsoft.Extensions.DependencyInjection;
using SPAMiddleware;

namespace Jukebox
{
    public static class ConfigureServicesExtensions
    {
        public static IServiceProvider ConfigureJukebox(this IServiceCollection services)
        {
            services.ConfigureServices();
            
            var builder = new ContainerBuilder();
            builder.ConfigureContainerBuilder();
            
            builder.Populate(services);
            return new AutofacServiceProvider(builder.Build());
        }

        private static IServiceCollection ConfigureServices(this IServiceCollection services)
        {

            services.AddSpaMiddleware("",new []{"/api","/swagger"})
                .AddMvc();
                

            return services;
        }

        private static ContainerBuilder ConfigureContainerBuilder(this ContainerBuilder builder)
        {
            return builder.ConfigureAuth();
        }

        private static ContainerBuilder ConfigureAuth(this ContainerBuilder builder)
        {
            builder.RegisterType<JwtAuthenticationService>()
                .As<IAuthenticationService>()
                .EnableInterfaceInterceptors()
                .InterceptedBy(typeof(AuthenticationServiceInterceptor));

            builder.RegisterType<AuthenticationServiceInterceptor>();
            builder.RegisterType<AuthenticationValidator>();

            return builder;
        }
    }
}