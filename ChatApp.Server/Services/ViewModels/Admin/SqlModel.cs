namespace ChatApp.Server.Services.ViewModels.Admin
{
    public class SqlQueryRequest
    {
        public string Query { get; set; }
    }

    public class SqlQueryResult
    {
        public List<string> Columns { get; set; } = new();
        public List<List<object>> Rows { get; set; } = new();
        public string Message { get; set; }
    }
}
