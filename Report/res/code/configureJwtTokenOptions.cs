builder.RegisterInstance(new JwtTokenOptions
{
   Issuer = "JB_AUTHORITY",
   Audience = "JB_AUDIENCE",
   Expiration = TimeSpan.FromHours(1),
   RefreshTokenExpiration = TimeSpan.FromDays(30),
   SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
});
