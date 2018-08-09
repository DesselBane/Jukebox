public class Song{
    [Key]
    public int Id { get; set; }
    public string FilePath { get; set; }
    public string Title { get; set; }

    [ForeignKey(nameof(Album))]
    public int AlbumId { get; set; }
    public Album Album { get; set; }
    public DateTime LastTimeIndexed { get; set; }

    [NotMapped]
    public SongSource SourceType { get; set; } = SongSource.CustomBackend;
}
