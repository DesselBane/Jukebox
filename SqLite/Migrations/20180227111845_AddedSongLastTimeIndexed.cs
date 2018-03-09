using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Jukebox.Database.SqLite.Migrations
{
    public partial class AddedSongLastTimeIndexed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                                                 "LastTimeIndexed",
                                                 "Songs",
                                                 nullable: false,
                                                 defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                                        "LastTimeIndexed",
                                        "Songs");
        }
    }
}