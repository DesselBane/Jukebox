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
        Task<Player> GetPlayerByIdAsync(int playerId);
        Task CreateSocketPlayerAsync(WebSocket socket);
        Task AddSongToPlayerAsync(int playerId, int songId);
        Task ExecuteCommandAsync(int playerId, PlayerCommand cmd);
    }
}