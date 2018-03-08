using System;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.DataModel;
using PlayerObj = Jukebox.Common.Abstractions.DataModel.Player;

namespace Jukebox.Testing.Acceptance.Extensions
{
    public static class PlayerExtensions
    {
        public static async Task<PlayerObj> CreatePlayerAsync(this DataContext dataContext,string name = null, bool isActive = true)
        {
            var player = new PlayerObj
                         {
                             IsActive = isActive,
                             Name     = name ?? Guid.NewGuid().ToString()
                         };

            dataContext.Players.Add(player);
            await dataContext.SaveChangesAsync();
            return player;
        }

        public static async Task GrantCreatePlayerRight(this DataContext dataContext, User user)
        {
            throw new NotImplementedException();
        }

        public static async Task GrantUpdatePlayerRight(this DataContext dataContext, User user)
        {
            throw new NotImplementedException();
        }

        public static async Task GrantDeletePlayerRight(this DataContext dataContext, User user)
        {
            throw new NotImplementedException();
        }

        public static PlayerObj CreateDefaultPlayer()
        {
            return new PlayerObj
                   {
                       Id = -1,
                       IsActive = false,
                       Name     = Guid.NewGuid().ToString()
                   };
        }
    }
}