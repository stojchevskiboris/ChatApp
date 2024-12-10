using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateUserDefinedTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE TYPE IntListType AS TABLE (
                    Value INT
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TYPE StringListType AS TABLE (
                    Value NVARCHAR(MAX)
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TYPE IF EXISTS StringListType;");
            migrationBuilder.Sql("DROP TYPE IF EXISTS IntListType;");
        }
    }
}
