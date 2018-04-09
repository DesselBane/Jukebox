using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Jukebox.Common.Security
{
    public class ElectronAuthenticationInterceptor : IInterceptor
    {
        private readonly IHostingEnvironment _environment;
        private readonly JwtTokenOptions _tokenOptions;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ElectronAuthenticationInterceptor(IHostingEnvironment environment, JwtTokenOptions tokenOptions, IHttpContextAccessor httpContextAccessor)
        {
            _environment = environment;
            _tokenOptions = tokenOptions;
            _httpContextAccessor = httpContextAccessor;
        }

        // Only intercept if electron environment is set and the request comes from a local IP
        public void Intercept(IInvocation invocation)
        {
            if (_environment.EnvironmentName.ToLower() == "electron"
                && _httpContextAccessor.HttpContext.Connection.RemoteIpAddress != null
                && IPAddress.IsLoopback(_httpContextAccessor.HttpContext.Connection.RemoteIpAddress)
                && invocation.Method.Name == nameof(IAuthenticationService.AuthenticateAsync))
            {
                var user = User.ElectronUser;
                var token = JwtAuthenticationService.CreateBasicAuthToken(user,_tokenOptions);

                invocation.ReturnValue = Task.FromResult(token);
            }
            else
                invocation.Proceed();
        }

        
    }
}