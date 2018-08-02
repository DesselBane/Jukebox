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
    var websocketOptions = app.ApplicationServices
                                 .GetService<IOptions<WebsocketOptions>>()
                                 .Value;
    app.UseWebSockets(new WebSocketOptions
                      {
                          KeepAliveInterval = websocketOptions.KeepAliveInterval,
                          ReceiveBufferSize = websocketOptions.BufferSize
                      });
    app.UseMvc();
    app.UseStaticFiles();
}
