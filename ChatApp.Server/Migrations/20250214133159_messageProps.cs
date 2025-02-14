using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class messageProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Media_MessageId",
                table: "Media");

            migrationBuilder.CreateIndex(
                name: "IX_Media_MessageId",
                table: "Media",
                column: "MessageId",
                unique: true,
                filter: "[MessageId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Media_MessageId",
                table: "Media");

            migrationBuilder.CreateIndex(
                name: "IX_Media_MessageId",
                table: "Media",
                column: "MessageId");
        }
    }
}
