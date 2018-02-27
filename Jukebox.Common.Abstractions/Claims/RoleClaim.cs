using System;
using System.Security.Claims;

namespace Jukebox.Common.Abstractions.Claims
{
    public class RoleClaim : Claim
    {
        public RoleClaim(RoleClaimTypes value)
            : base(ROLE_CLAIM_TYPE, value.ToString(), ClaimValueType) { }

        public RoleClaim(RoleClaimTypes value, string issuer)
            : base(ROLE_CLAIM_TYPE, value.ToString(), ClaimValueType, issuer) { }

        public RoleClaim(RoleClaimTypes value, string issuer, string originalIssuer)
            : base(ROLE_CLAIM_TYPE, value.ToString(), ClaimValueType, issuer, originalIssuer) { }

        public RoleClaimTypes RoleType
        {
            get
            {
                if (!Enum.TryParse(Value, true, out RoleClaimTypes type))
                    throw new InvalidOperationException("Could not parse RoleClaimType");
                return type;
            }
        }

        #region Const

        public const string ROLE_CLAIM_TYPE = "http://Jukebox/Claims/Security/Role";
        public const string ClaimValueType       = ClaimValueTypes.String;

        #endregion
    }
}