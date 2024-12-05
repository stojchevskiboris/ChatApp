using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class requestNotNullProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_UserFromId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_UserToId",
                table: "Requests");

            migrationBuilder.AlterColumn<int>(
                name: "UserToId",
                table: "Requests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "UserFromId",
                table: "Requests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_UserFromId",
                table: "Requests",
                column: "UserFromId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_UserToId",
                table: "Requests",
                column: "UserToId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_UserFromId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_UserToId",
                table: "Requests");

            migrationBuilder.AlterColumn<int>(
                name: "UserToId",
                table: "Requests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "UserFromId",
                table: "Requests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_UserFromId",
                table: "Requests",
                column: "UserFromId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_UserToId",
                table: "Requests",
                column: "UserToId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
