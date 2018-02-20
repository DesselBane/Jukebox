using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;

namespace Jukebox.Common.Abstractions.DataModel
{
    [DataContract]
    public class User
    {
        #region Const

        public const string USER_AUTH_TYPE = "CustomWebAuth";

        #endregion

        #region Properties

        [DataMember]
        public virtual int Id { get; set; }

        [DataMember]
        public virtual string EMail { get; set; }
        public virtual string Password { get; set; }
        public virtual string Salt { get; set; }
        public virtual string ResetHash { get; set; }
        public virtual string RefreshToken { get; set; }
        public virtual DateTime? RefreshTokenExpiration { get; set; }

        public virtual List<UserClaim> Claims { get; set; } = new List<UserClaim>();

        #endregion

        public ClaimsIdentity ToClaimsIdentity()
        {
            return new ClaimsIdentity(Claims.Select(x => x.ToClaim()), USER_AUTH_TYPE, UsernameClaim.USERNAME_CLAIM_TYPE, ClaimsIdentity.DefaultRoleClaimType);
        }

        public static implicit operator ClaimsIdentity(User usr)
        {
            return usr.ToClaimsIdentity();
        }

        public bool HasClaim(string claimType, string value = "")
        {
            return Claims.Any(x => x.Type == claimType && (value == "" || x.Value == value));
        }

        public bool HasClaim(string claimType, int value)
        {
            return HasClaim(claimType, value.ToString());
        }
    }
}