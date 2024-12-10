using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSearchUsersSp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create the stored procedure
            migrationBuilder.Sql(@"
                CREATE PROCEDURE SearchUsersToAdd
                    @currentUserId INT,
                    @terms StringListType READONLY,
                    @contactIds IntListType READONLY
                AS
                BEGIN
                    SELECT *
                    FROM Users u
                    WHERE u.Id != @currentUserId
                      AND u.Id NOT IN (SELECT Value FROM @contactIds)
                      AND EXISTS (
                          SELECT 1
                          FROM @terms t
                          WHERE LOWER(u.FirstName) LIKE '%' + t.Value + '%'
                             OR LOWER(u.LastName) LIKE '%' + t.Value + '%'
                      );
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS SearchUsersToAdd;");
        }
    }
}
