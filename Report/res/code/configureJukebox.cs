public static IServiceProvider ConfigureJukebox(this IServiceCollection services,
                                                           IConfiguration config)
{
  services.ConfigureServices(config);

  var builder = new ContainerBuilder();
  builder.ConfigureContainerBuilder(config);

  builder.Populate(services);
  builder.ConfigureControllers();
  return new AutofacServiceProvider(builder.Build());
}
