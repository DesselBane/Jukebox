using System;
using Jukebox.Common.Abstractions.Email;
using Newtonsoft.Json;

namespace Jukebox.Options
{
    public sealed class EmailServiceConfiguration : IEmailServiceConfiguration
    {
        public void ThrowIfMisconfigured()
        {
            if (UseDummyService)
                return;

            if (Port <= 0)
                throw new ArgumentException("port must be a value of greater then 0", nameof(Port));
            if (string.IsNullOrWhiteSpace(Host))
                throw new ArgumentException("host cannot be null or whitespace", nameof(Host));

            if (UseAuthentication)
            {
                if (string.IsNullOrWhiteSpace(Username))
                    throw new ArgumentException("username cannot be null or whitespace", nameof(Username));
                if (string.IsNullOrWhiteSpace(Password))
                    throw new ArgumentException("password cannot be null or whitespace", nameof(Password));
            }
        }

        public override string ToString() => JsonConvert.SerializeObject(this);

        #region Properties

        /// <inheritdoc />
        public int Port { get; set; }

        /// <inheritdoc />
        public string Host { get; set; }

        /// <inheritdoc />
        public bool UseAuthentication { get; set; }

        /// <inheritdoc />
        public string Username { get; set; }

        /// <inheritdoc />
        public string Password { get; set; }

        public bool UseDummyService { get; set; }

        #endregion
    }
}