using System;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Claims;
using Jukebox.Common.Abstractions.DataModel;
using Microsoft.EntityFrameworkCore;
using PlayerObj = Jukebox.Common.Abstractions.DataModel.Player;

namespace Jukebox.Testing.Acceptance.Extensions
{
    public static class PlayerTestExtensions
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

        private static async Task GrantPlayerAdminRole(DataContext dataContext, User user)
        {
            var dbUser = await dataContext.Users
                                          .Include(x => x.Claims)
                                          .FirstOrDefaultAsync(x => x.Id == user.Id);
            
            if(dbUser == null)
                throw new InvalidOperationException();
            
            if(!dbUser.HasClaim(RoleClaim.ROLE_CLAIM_TYPE,RoleClaimTypes.PlayerAdmin.ToString()))
                dbUser.Claims.Add(new RoleClaim(RoleClaimTypes.PlayerAdmin));

            await dataContext.SaveChangesAsync();
        }
        
        public static Task GrantCreatePlayerRight(this DataContext dataContext, User user) => GrantPlayerAdminRole(dataContext, user);

        public static Task GrantUpdatePlayerRight(this DataContext dataContext, User user) => GrantPlayerAdminRole(dataContext, user);

        public static Task GrantDeletePlayerRight(this DataContext dataContext, User user) => GrantPlayerAdminRole(dataContext, user);

        public static PlayerObj CreateDefaultPlayer() => new PlayerObj
                                                         {
                                                             Id       = -1,
                                                             IsActive = false,
                                                             Name     = Guid.NewGuid().ToString()
                                                         };
    }
}