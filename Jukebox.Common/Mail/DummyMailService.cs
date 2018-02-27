using System;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Email;

namespace Jukebox.Common.Mail
{
    public class DummyMailService : IEmailService
    {
        #region Constructors

        public DummyMailService(IEmailServiceConfiguration config)
        {
            Configuration = config;
        }

        #endregion

        #region Properties

        public IEmailServiceConfiguration Configuration { get; }

        #endregion

        public Task SendMessageAsync(IEmail mail)
        {
            return Task.Run(() =>
                            {
                                Console.WriteLine("--------------------------- EMAIL ---------------------------");
                                Console.WriteLine($"Message to: {mail.To}");
                                Console.WriteLine($"Message from: {mail.From}");
                                Console.WriteLine($"Subject: {mail.Subject}");
                                Console.WriteLine($"Message: {mail.Body}");
                            });
        }
    }
}