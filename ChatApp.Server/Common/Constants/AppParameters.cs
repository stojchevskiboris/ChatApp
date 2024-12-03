namespace ChatApp.Server.Common.Constants
{
    public static class AppParameters
    {
        public static string GiphyApiURL(string query, int limit, string rating, string apiKey) {
            string baseUrl = "https://api.giphy.com/v1/gifs/search";
            return $"{baseUrl}?q={query}&limit={limit}&rating={rating}&api_key={apiKey}";
        }
    }
}
