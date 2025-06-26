using System.ComponentModel;

namespace ChatApp.Server.Domain.Enums
{
    public enum UserRoleEnum
    {
        [Description("User")]
        User = 0,

        [Description("Moderator")]
        Moderator = 1,

        [Description("Admin")]
        Admin = 2,
    }
}
