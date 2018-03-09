using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Jukebox.Database.SqLite.Migrations
{
    public partial class AddedIndexonSongFilePath : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Songs_FilePath",
                table: "Songs",
                column: "FilePath",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Songs_FilePath",
                table: "Songs");
        }
    }
}
