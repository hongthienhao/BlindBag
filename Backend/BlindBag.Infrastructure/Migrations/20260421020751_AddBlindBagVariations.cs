using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlindBag.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBlindBagVariations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlindBagVariations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlindBagId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ProbabilityWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlindBagVariations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlindBagVariations_BlindBag",
                        column: x => x.BlindBagId,
                        principalTable: "BlindBags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlindBagVariations_BlindBagId",
                table: "BlindBagVariations",
                column: "BlindBagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlindBagVariations");
        }
    }
}
