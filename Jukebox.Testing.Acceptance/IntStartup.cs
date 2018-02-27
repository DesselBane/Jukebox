using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Database.SqLite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Jukebox.Testing.Acceptance
{
    public class IntStartup : Startup
    {
        public IntStartup(IConfiguration configuration)
            : base(configuration) { }

        #region Overrides of Startup

        public override IServiceProvider ConfigureServices(IServiceCollection services)
        {
            var builder = new ContainerBuilder();

            services.ConfigureServices(Configuration);

            builder.ConfigureContainerBuilder(Configuration);
            builder.RegisterInstance(new SqLiteDataContext($"Data Source=test{Guid.NewGuid().ToString()}.db"))
                   .As<DataContext>();

            builder.Populate(services);
            builder.ConfigureControllers();
            return new AutofacServiceProvider(builder.Build());
        }

        #endregion
    }
}