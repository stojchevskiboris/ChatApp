using System.ComponentModel;

namespace ChatApp.Server.Domain.Enums
{
    public enum RequestStatusEnum
    {
        [Description("Pending")]
        Pending = 1, // initial status

        [Description("Canceled")]
        Canceled = 2, // sender cancels the request

        [Description("Approved")]
        Approved = 3, // reciever appoves the request

        [Description("Rejected")]
        Rejected = 4 // reciever rejects the request
    }
}
