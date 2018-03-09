using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Players;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Common.Players
{
    public class PlayerService : IPlayerService
    {
        private readonly DataContext _dataContext;

        public PlayerService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        
        public async Task<IEnumerable<Player>> GetAllPlayersAsync() => await _dataContext.Players.ToListAsync();

        public Task<Player> GetPlayerByIdAsync(int playerId) => _dataContext.Players.FirstOrDefaultAsync(x => x.Id == playerId);

        public async Task<Player> CreatePlayerAsync(Player player)
        {
            player.Id = 0;

            _dataContext.Players.Add(player);
            await _dataContext.SaveChangesAsync();
            return player;
        }

        public async Task<Player> UpdatePlayerAsync(Player player)
        {
            var dbPlayer = await _dataContext.Players.FirstOrDefaultAsync(x => x.Id == player.Id);

            dbPlayer.IsActive = player.IsActive;
            dbPlayer.Name = player.Name;

            await _dataContext.SaveChangesAsync();
            return dbPlayer;
        }

        public async Task DeletePlayerAsync(int playerId)
        {
            _dataContext.Players.Remove(await _dataContext.Players.FirstOrDefaultAsync(x => x.Id == playerId));
            await _dataContext.SaveChangesAsync();
        }
    }
}