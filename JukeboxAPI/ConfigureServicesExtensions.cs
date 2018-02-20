using System;
using System.Security.Claims;
using System.Text;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Autofac.Extras.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Email;
using Jukebox.Common.Abstractions.Security;
using Jukebox.Common.Mail;
using Jukebox.Common.Security;
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
        private static readonly string SecretKey = "67F4189B-3206-47DB-9BDB-41D93F6B0D71";
        
        public static IServiceProvider ConfigureJukebox(this IServiceCollection services, IConfiguration config)
        {
            services.ConfigureServices(config);
            
            var builder = new ContainerBuilder();
            builder.ConfigureContainerBuilder(config);
            
            builder.Populate(services);
            return new AutofacServiceProvider(builder.Build());
        }

        private static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration config)
        {
            return services.AddSpaMiddleware("",new []{"/api","/swagger"})
                .ConfigureAuthService()
                .ConfigureMvc();
        }

        private static ContainerBuilder ConfigureContainerBuilder(this ContainerBuilder builder, IConfiguration config)
        {
            return builder.ConfigureAuth()
                .ConfigureDatabase()
                .ConfigureEMail(config);
        }

        private static IServiceCollection ConfigureMvc(this IServiceCollection services)
        {
            //Creating Global Authorization Filter
            var globalAuthFilter = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();


            services.AddMvc(options => { options.Filters.Add(new AuthorizeFilter(globalAuthFilter)); })
                .AddControllersAsServices()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                });

            return services;
        }
        
        private static IServiceCollection ConfigureAuthService(this IServiceCollection services)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

            var tokenValidationParams = new TokenValidationParameters
            {
                // The signing key must match!
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,

                // Validate the JWT Issuer (iss) claim
                ValidateIssuer = true,
                ValidIssuer = "ES_AUTHORITY",

                // Validate the JWT Audience (aud) claim
                ValidateAudience = true,
                ValidAudience = "ES_AUDIENCE",

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
                Issuer = "ES_AUTHORITY",
                Audience = "ES_AUDIENCE",
                Expiration = TimeSpan.FromHours(1),
                RefreshTokenExpiration = TimeSpan.FromDays(30),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
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
            builder.RegisterType<DataContext>()
                .As<SqLiteDataContext>();

            return builder;
        }
        
        private static ContainerBuilder ConfigureEMail(this ContainerBuilder builder, IConfiguration configurationRoot)
        {
            var mailOptions = configurationRoot.GetSection("eMail").Get<EmailServiceConfiguration>();
            mailOptions.ThrowIfMisconfigured();

            if (mailOptions.UseDummyService)
            {
                builder.RegisterType<DummyMailService>()
                    .As<IEmailService>()
                    .SingleInstance();
            }
            else
            {
                builder.RegisterType<MailKitEmailService>()
                    .As<IEmailService>()
                    .SingleInstance();
            }

            builder.RegisterInstance(mailOptions)
                .As<IEmailServiceConfiguration>();
            
            

            return builder;
        }
    }
}