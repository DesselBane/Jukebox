using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;

namespace Jukebox.Common.Abstractions.Players
{
    public interface IPlayerService
    {
        Task<IEnumerable<Player>> GetAllPlayersAsync();
        Task<Player>              GetPlayerByIdAsync(int   playerId);
        Task<Guid>              CreatePlayerAsync(Player player);
        Task CreateSocketPlayerAsync(WebSocket socket, Guid playerId);
    }
}