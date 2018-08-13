public partial class Initial : Migration {
  protected override void Up(MigrationBuilder migrationBuilder) {
    migrationBuilder.CreateTable(
       name: "Albums",
       columns: table => new
       {
           Id = table.Column<int>(nullable: false)
               .Annotation("Sqlite:Autoincrement", true),
           ArtistId = table.Column<int>(nullable: false),
           Name = table.Column<string>(nullable: true)
       },
       constraints: table =>
       {
           table.PrimaryKey("PK_Albums", x => x.Id);
           table.ForeignKey(
               name: "FK_Albums_Artists_ArtistId",
               column: x => x.ArtistId,
               principalTable: "Artists",
               principalColumn: "Id",
               onDelete: ReferentialAction.Cascade);
       });
       [...]
  }
  protected override void Down(MigrationBuilder migrationBuilder) {
    migrationBuilder.DropTable(
               name: "Albums");
    [...]
  }
