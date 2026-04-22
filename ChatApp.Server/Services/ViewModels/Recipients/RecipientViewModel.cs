namespace ChatApp.Server.Services.ViewModels.Recipients
{
    public class RecipientViewModel
    {
        public int Id { get; set; }
        public int RecipientTypeId { get; set; }
        public int? RecipientUserId { get; set; }
        public string? RecipientUsername { get; set; }
        public int? RecipientGroupId { get; set; }
        public string? RecipientGroupName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
