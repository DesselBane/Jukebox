using Microsoft.EntityFrameworkCore.Migrations;

namespace Jukebox.Database.SqLite.Migrations
{
    public partial class AlbumArtistsSong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                                               "Album",
                                               "Songs",
                                               nullable: true);

            migrationBuilder.AddColumn<string>(
                                               "ArtistsDb",
                                               "Songs",
                                               nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                                        "Album",
                                        "Songs");

            migrationBuilder.DropColumn(
                                        "ArtistsDb",
                                        "Songs");
        }
    }
}