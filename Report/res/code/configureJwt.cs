private static IServiceCollection ConfigureAuthService(this IServiceCollection services){
    var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));
    var tokenValidationParams = new TokenValidationParameters
                                {
                                    // The signing key must match!
                                    ValidateIssuerSigningKey = true,
                                    IssuerSigningKey = signingKey,
                                    // Validate the JWT Issuer (iss) claim
                                    ValidateIssuer = true,
                                    ValidIssuer = "JB_AUTHORITY",
                                    // Validate the JWT Audience (aud) claim
                                    ValidateAudience = true,
                                    ValidAudience = "JB_AUDIENCE",
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
