using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

// ReSharper disable VirtualMemberNeverOverridden.Global

namespace Jukebox.Common.Abstractions.DataModel
{
    public abstract class DataContext : DbContext
    {
        #region Configuration

        private static void ConfigureSong(EntityTypeBuilder<Song> builder)
        {
            builder.HasIndex(x => x.FilePath)
                   .IsUnique();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureSong(modelBuilder.Entity<Song>());

            base.OnModelCreating(modelBuilder);
        }

        #endregion

        #region DbSets

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserClaim> Claims { get; set; }
        public virtual DbSet<Song> Songs { get; set; }

        #endregion
    }
}