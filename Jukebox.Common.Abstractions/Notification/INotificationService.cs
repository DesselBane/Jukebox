using System.Net.WebSockets;
using System.Threading.Tasks;

namespace Jukebox.Common.Abstractions.Notification
{
    public interface INotificationService
    {
        Task NotifyClientsAsync(Notification notification);
        Task CreateNotificationWebsocketAsync(WebSocket socket);
    }
}