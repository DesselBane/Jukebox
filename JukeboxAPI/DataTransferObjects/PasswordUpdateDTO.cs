﻿using System.Runtime.Serialization;

namespace Jukebox.DataTransferObjects
{
    [DataContract]
    public class PasswordUpdateDTO
    {
        #region Properties

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public string ResetHash { get; set; }

        #endregion
    }
}