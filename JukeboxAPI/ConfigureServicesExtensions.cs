﻿using System;
using System.Security.Claims;
using System.Text;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Autofac.Extras.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Email;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Abstractions.Songs;
using Jukebox.Common.Interception;
using Jukebox.Common.Mail;
using Jukebox.Common.Security;
using Jukebox.Common.Songs;
using Jukebox.Controllers;
using Jukebox.Database.SqLite;
using Jukebox.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SPAMiddleware;

namespace Jukebox
{
    public static class ConfigureServicesExtensions
    {
        private static readonly string SecretKey = "67F4189B320647DB9BDB41D93F6B0D71";

        public static IServiceProvider ConfigureJukebox(this IServiceCollection services, IConfiguration config)
        {
            services.ConfigureServices(config);

            var builder = new ContainerBuilder();
            builder.ConfigureContainerBuilder(config);

            builder.Populate(services);
            builder.ConfigureControllers();
            return new AutofacServiceProvider(builder.Build());
        }

        public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration config) =>
            services.AddSpaMiddleware("", new[] {"/api", "/swagger"})
                    .ConfigureAuthService()
                    .ConfigureMvc();

        public static ContainerBuilder ConfigureContainerBuilder(this ContainerBuilder builder, IConfiguration config) =>
            builder.ConfigureAuth()
                   .ConfigureDatabase()
                   .ConfigureEMail(config)
                   .ConfigureHosting(config)
                   .ConfigureIndexing();

        private static IServiceCollection ConfigureMvc(this IServiceCollection services)
        {
            //Creating Global Authorization Filter
            var globalAuthFilter = new AuthorizationPolicyBuilder()
                                   .RequireAuthenticatedUser()
                                   .Build();


            services.AddMvc(options => { options.Filters.Add(new AuthorizeFilter(globalAuthFilter)); })
                    .AddControllersAsServices()
                    .AddJsonOptions(options => { options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc; });

            return services;
        }

        private static IServiceCollection ConfigureAuthService(this IServiceCollection services)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

            var tokenValidationParams = new TokenValidationParameters
                                        {
                                            // The signing key must match!
                                            ValidateIssuerSigningKey = true,
                                            IssuerSigningKey         = signingKey,

                                            // Validate the JWT Issuer (iss) claim
                                            ValidateIssuer = true,
                                            ValidIssuer    = "JB_AUTHORITY",

                                            // Validate the JWT Audience (aud) claim
                                            ValidateAudience = true,
                                            ValidAudience    = "JB_AUDIENCE",

                                            // Validate the token expiry
                                            ValidateLifetime = true,

                                            // If you want to allow a certain amount of clock drift, set that here:
                                            ClockSkew = TimeSpan.Zero
                                        };

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options => { options.TokenValidationParameters = tokenValidationParams; });

            services.AddSingleton(tokenValidationParams);
            return services;
        }

        private static ContainerBuilder ConfigureAuth(this ContainerBuilder builder)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

            builder.RegisterType<JwtAuthenticationService>()
                   .As<IAuthenticationService>()
                   .EnableInterfaceInterceptors()
                   .InterceptedBy(typeof(AuthenticationServiceInterceptor));

            builder.RegisterType<AuthenticationServiceInterceptor>();
            builder.RegisterType<AuthenticationValidator>();

            builder.RegisterInstance(new JwtTokenOptions
                                     {
                                         Issuer                 = "JB_AUTHORITY",
                                         Audience               = "JB_AUDIENCE",
                                         Expiration             = TimeSpan.FromHours(1),
                                         RefreshTokenExpiration = TimeSpan.FromDays(30),
                                         SigningCredentials     = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                                     }).SingleInstance();

            //Injecting Current ClaimsIdentity
            builder.RegisterType<HttpContextAccessor>()
                   .As<IHttpContextAccessor>()
                   .SingleInstance();

            builder.Register(x => x.Resolve<IHttpContextAccessor>().HttpContext.User.Identity as ClaimsIdentity ??
                                  new ClaimsIdentity());


            return builder;
        }

        private static ContainerBuilder ConfigureDatabase(this ContainerBuilder builder)
        {
            builder.RegisterType<SqLiteDataContext>()
                   .As<DataContext>();

            return builder;
        }

        private static ContainerBuilder ConfigureEMail(this ContainerBuilder builder, IConfiguration configurationRoot)
        {
            var mailOptions = configurationRoot.GetSection("eMail").Get<EmailServiceConfiguration>();
            mailOptions.ThrowIfMisconfigured();

            if (mailOptions.UseDummyService)
                builder.RegisterType<DummyMailService>()
                       .As<IEmailService>()
                       .SingleInstance();
            else
                builder.RegisterType<MailKitEmailService>()
                       .As<IEmailService>()
                       .SingleInstance();

            builder.RegisterInstance(mailOptions)
                   .As<IEmailServiceConfiguration>();


            return builder;
        }

        private static ContainerBuilder ConfigureHosting(this ContainerBuilder builder,
                                                         IConfiguration        configurationRoot)
        {
            var hostingOptions = configurationRoot.GetSection("hosting").Get<HostingOptions>();

            builder.RegisterInstance(hostingOptions)
                   .As<IHostingOptions>();

            return builder;
        }

        public static ContainerBuilder ConfigureControllers(this ContainerBuilder builder)
        {
            builder.RegisterType<ControllerInterceptor>();

            builder.RegisterType<AuthController>()
                   .EnableClassInterceptors()
                   .InterceptedBy(typeof(ControllerInterceptor));

            builder.RegisterType<SongController>()
                   .EnableClassInterceptors()
                   .InterceptedBy(typeof(ControllerInterceptor));

            return builder;
        }

        private static ContainerBuilder ConfigureIndexing(this ContainerBuilder builder)
        {
            builder.RegisterType<IndexingService>()
                   .As<IIndexingService>();

            return builder;
        }
    }
}