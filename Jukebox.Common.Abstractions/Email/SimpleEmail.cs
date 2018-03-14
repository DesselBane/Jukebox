using Newtonsoft.Json;

namespace Jukebox.Common.Abstractions.Email
{
    public class SimpleEmail : IEmail
    {
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }

        #region Implementation of IEmail

        public string To { get; set; }

        public string From { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        #endregion
    }
}