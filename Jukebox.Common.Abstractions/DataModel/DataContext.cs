using Microsoft.EntityFrameworkCore;
// ReSharper disable VirtualMemberNeverOverridden.Global

namespace Jukebox.Common.Abstractions.DataModel
{
    public abstract class DataContext : DbContext
    {
        #region DbSets

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserClaim> Claims { get; set; }
        public virtual DbSet<Song> Songs { get; set; }

        #endregion

        #region Configuration

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        #endregion
    }
}