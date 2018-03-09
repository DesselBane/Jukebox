using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;

namespace Jukebox.Common.Abstractions.Players
{
    public interface IPlayerService
    {
        Task<IEnumerable<Player>> GetAllPlayersAsync();
        Task<Player>              GetPlayerByIdAsync(int   playerId);
        Task<Player>              CreatePlayerAsync(Player player);
        Task<Player>              UpdatePlayerAsync(Player player);
        Task                      DeletePlayerAsync(int    playerId);
    }
}