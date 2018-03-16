using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Jukebox.Data.SqLite.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                                         "Songs",
                                         table => new
                                                  {
                                                      Id = table.Column<int>(nullable: false)
                                                                .Annotation("Sqlite:Autoincrement", true),
                                                      Album = table.Column<string>(nullable: true),
                                                      ArtistsDb = table.Column<string>(nullable: true),
                                                      FilePath = table.Column<string>(nullable: true),
                                                      LastTimeIndexed = table.Column<DateTime>(nullable: false),
                                                      Title = table.Column<string>(nullable: true)
                                                  },
                                         constraints: table => { table.PrimaryKey("PK_Songs", x => x.Id); });

            migrationBuilder.CreateTable(
                                         "Users",
                                         table => new
                                                  {
                                                      Id = table.Column<int>(nullable: false)
                                                                .Annotation("Sqlite:Autoincrement", true),
                                                      EMail = table.Column<string>(nullable: true),
                                                      Password = table.Column<string>(nullable: true),
                                                      RefreshToken = table.Column<string>(nullable: true),
                                                      RefreshTokenExpiration = table.Column<DateTime>(nullable: true),
                                                      ResetHash = table.Column<string>(nullable: true),
                                                      Salt = table.Column<string>(nullable: true)
                                                  },
                                         constraints: table => { table.PrimaryKey("PK_Users", x => x.Id); });

            migrationBuilder.CreateTable(
                                         "Claims",
                                         table => new
                                                  {
                                                      Id = table.Column<int>(nullable: false)
                                                                .Annotation("Sqlite:Autoincrement", true),
                                                      Issuer = table.Column<string>(nullable: true),
                                                      OriginalIssuer = table.Column<string>(nullable: true),
                                                      Type = table.Column<string>(nullable: false),
                                                      User_Id = table.Column<int>(nullable: false),
                                                      Value = table.Column<string>(nullable: false),
                                                      ValueType = table.Column<string>(nullable: true)
                                                  },
                                         constraints: table =>
                                                      {
                                                          table.PrimaryKey("PK_Claims", x => x.Id);
                                                          table.ForeignKey(
                                                                           "FK_Claims_Users_User_Id",
                                                                           x => x.User_Id,
                                                                           "Users",
                                                                           "Id",
                                                                           onDelete: ReferentialAction.Cascade);
                                                      });

            migrationBuilder.CreateIndex(
                                         "IX_Claims_User_Id",
                                         "Claims",
                                         "User_Id");

            migrationBuilder.CreateIndex(
                                         "IX_Songs_FilePath",
                                         "Songs",
                                         "FilePath",
                                         unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                                       "Claims");

            migrationBuilder.DropTable(
                                       "Songs");

            migrationBuilder.DropTable(
                                       "Users");
        }
    }
}