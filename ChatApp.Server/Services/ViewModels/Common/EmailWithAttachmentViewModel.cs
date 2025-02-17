namespace ChatApp.Server.Services.ViewModels.Common
{
    public class EmailWithAttachmentViewModel
    {
        public string FileName { get; set; }
        public byte[] Bytes { get; set; }
    }
}