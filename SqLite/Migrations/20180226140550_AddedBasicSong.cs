using Microsoft.EntityFrameworkCore.Migrations;

namespace Jukebox.Database.SqLite.Migrations
{
    public partial class AddedBasicSong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                                         "Songs",
                                         table => new
                                                  {
                                                      Id = table.Column<int>(nullable: false)
                                                                .Annotation("Sqlite:Autoincrement", true),
                                                      FilePath = table.Column<string>(nullable: true),
                                                      Title    = table.Column<string>(nullable: true)
                                                  },
                                         constraints: table => { table.PrimaryKey("PK_Songs", x => x.Id); });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                                       "Songs");
        }
    }
}