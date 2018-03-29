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

            builder.HasOne(x => x.Album)
                   .WithMany(x => x.Songs)
                   .HasForeignKey(x => x.AlbumId);
        }

        private static void ConfigureAlbum(EntityTypeBuilder<Album> builder)
        {
            builder.HasOne(x => x.Artist)
                   .WithMany(x => x.Albums)
                   .HasForeignKey(x => x.ArtistId);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureSong(modelBuilder.Entity<Song>());
            ConfigureAlbum(modelBuilder.Entity<Album>());

            base.OnModelCreating(modelBuilder);
        }

        #endregion

        #region DbSets

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserClaim> Claims { get; set; }
        public virtual DbSet<Song> Songs { get; set; }
        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Artist> Artists { get; set; }

        #endregion
    }
}