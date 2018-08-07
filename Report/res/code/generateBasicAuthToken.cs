public static AuthToken CreateBasicAuthToken(ClaimsIdentity identity, JwtTokenOptions options){
  var now = DateTime.UtcNow;
  var claims = new List<Claim>();
  claims.Add(new Claim(JwtRegisteredClaimNames.Sub, identity.Name));
  claims.Add(new Claim(JwtRegisteredClaimNames.Jti, options.NonceGenerator()));
  claims.Add(new Claim(JwtRegisteredClaimNames.Iat, now.ToUnixEpochDate().ToString(), ClaimValueTypes.Integer64));
  claims.AddRange(identity.Claims);

  var token = new JwtSecurityToken(options.Issuer,
                                       options.Audience,
                                       claims.ToArray(),
                                       now,
                                       now.Add(options.Expiration),
                                       options.SigningCredentials);

  var refreshToken = Guid.NewGuid().ToString();
  var refreshTokenExpiration = now.Add(options.RefreshTokenExpiration);

  return new AuthToken
         {
             RefreshToken = refreshToken,
             AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
             AccessToken_ValidUntil = now.Add(options.Expiration),
             RefreshToken_ValidUntil = refreshTokenExpiration
         };
}
