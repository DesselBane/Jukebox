using System.Runtime.Serialization;

namespace JukeboxAPI.DataTransferObjects
{
    [DataContract]
    public class LoginDTO
    {
        #region Properties

        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public string Password { get; set; }

        #endregion
    }
}