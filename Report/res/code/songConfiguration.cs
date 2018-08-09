private static void ConfigureSong(EntityTypeBuilder<Song> builder)
{
    builder.HasIndex(x => x.FilePath)
           .IsUnique();

    builder.HasOne(x => x.Album)
           .WithMany(x => x.Songs)
           .HasForeignKey(x => x.AlbumId);
}
