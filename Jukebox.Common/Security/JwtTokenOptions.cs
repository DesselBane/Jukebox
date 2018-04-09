using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Jukebox.Common.Security
{
    public class JwtTokenOptions
    {
        public void ThrowIfInvalidOptions()
        {
            if (string.IsNullOrEmpty(Issuer))
                throw new ArgumentNullException(nameof(Issuer));

            if (string.IsNullOrEmpty(Audience))
                throw new ArgumentNullException(nameof(Audience));

            if (Expiration == TimeSpan.Zero)
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(Expiration));

            if (SigningCredentials == null)
                throw new ArgumentNullException(nameof(SigningCredentials));

            if (NonceGeneratorAsync == null)
                throw new ArgumentNullException(nameof(NonceGeneratorAsync));
        }

        #region Properties

        public TimeSpan RefreshTokenExpiration { get; set; } = TimeSpan.FromDays(30);

        /// <summary>
        ///     The Issuer (iss) claim for generated tokens.
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        ///     The Audience (aud) claim for the generated tokens.
        /// </summary>
        public string Audience { get; set; }

        /// <summary>
        ///     The expiration time for the generated tokens.
        /// </summary>
        /// <remarks>The default is five minutes (300 seconds).</remarks>
        public TimeSpan Expiration { get; set; } = TimeSpan.FromMinutes(5);

        /// <summary>
        ///     The signing key to use when generating tokens.
        /// </summary>
        public SigningCredentials SigningCredentials { get; set; }

        /// <summary>
        ///     Generates a random value (nonce) for each generated token.
        /// </summary>
        /// <remarks>The default nonce is a random GUID.</remarks>
        public Func<Task<string>> NonceGeneratorAsync => () => Task.FromResult(NonceGenerator());

        public Func<string> NonceGenerator => () => Guid.NewGuid().ToString();

        #endregion
    }
}