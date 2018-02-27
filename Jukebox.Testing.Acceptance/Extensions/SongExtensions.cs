using System;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Claims;
using Jukebox.Common.Abstractions.DataModel;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Testing.Acceptance.Extensions
{
    public static class SongExtensions
    {
        
        public static async Task GiveIndexAdminRoleAsync(this User user, DataContext dataContext)
        {
            var dbUser = await dataContext.Users
                                        .Include(x => x.Claims)
                                        .FirstOrDefaultAsync(x => x.Id == user.Id);
            
            if(dbUser == null)
                throw new InvalidOperationException();
            
            if(!dbUser.HasClaim(RoleClaim.ROLE_CLAIM_TYPE,RoleClaimTypes.IndexAdmin.ToString()))
                dbUser.Claims.Add(new RoleClaim(RoleClaimTypes.IndexAdmin));

            await dataContext.SaveChangesAsync();
        }
    }
}