namespace ChatApp.Server.Services.ViewModels.Common
{
    public class BaseSearchModel
    {
        public int Page { get; set; } = 0;
        public int Size { get; set; } = 10;
        public string SortColumn { get; set; } = "Id";
        public string SortDirection { get; set; } = "ASC";
    }
}