using System.ComponentModel;

namespace ChatApp.Server.Domain.Enums
{
    public enum RequestStatusEnum
    {
        [Description("Pending")]
        Pending = 1, // initial status

        [Description("Canceled")]
        Canceled = 2, // sender cancels the request

        [Description("Accepted")]
        Accepted = 3, // receiver accepts the request

        [Description("Rejected")]
        Rejected = 4 // receiver rejects the request
    }
}
