private static IServiceCollection ConfigureMvc(this IServiceCollection services){
    //Creating Global Authorization Filter
    var globalAuthFilter = new AuthorizationPolicyBuilder()
                           .RequireAuthenticatedUser()
                           .Build();

    services.AddMvc(options => { options.Filters.Add(new AuthorizeFilter(globalAuthFilter)); })
            .AddControllersAsServices(); |\label{line:confMvc_controller}|
    return services;
}
