﻿namespace ChatApp.Server.Common.Constants
{
    public static class AppParameters
    {
        public static string ConnectionString = string.Empty;

        public static string FirebaseConfig = "chatapp-7864e-firebase-adminsdk-5p04q-48e2ddcca1.json";

        public static string GiphyApiURL(string query, int limit, string rating, string apiKey) {
            string baseUrl = "https://api.giphy.com/v1/gifs/search";
            return $"{baseUrl}?q={query}&limit={limit}&rating={rating}&api_key={apiKey}";
        }
    }
}