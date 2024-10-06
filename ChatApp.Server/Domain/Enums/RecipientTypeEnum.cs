using System.ComponentModel;

namespace ChatApp.Server.Domain.Enums
{
    public enum RecipientTypeEnum
    {
        [Description("User")]
        User = 1,

        [Description("Group")]
        Group = 2
    }
}
