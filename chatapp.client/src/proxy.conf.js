const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7078';

const PROXY_CONFIG = [
  {
    context: [
      // Backend API contexts
      "/api",
      "/auth",
      "users"
    ],
    target,
    secure: false
  },
  {
    context: [
      "/giphy", // Proxy Giphy API requests
    ],
    target: "https://api.giphy.com",
    secure: true,
    changeOrigin: true,
    pathRewrite: { "^/giphy": "" }, 
  }
];

module.exports = PROXY_CONFIG;
