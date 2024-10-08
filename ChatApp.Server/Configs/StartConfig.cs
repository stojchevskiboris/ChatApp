using ChatApp.Server.Data.Implementations;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Validators;
using FluentValidation;

namespace ChatApp.Server.Configs
{
    public static class StartConfig
    {
        public static void ConfigureRepositories(this IServiceCollection services)
        {
            // --- Repository Registration ---
            services.AddScoped<IUserRepository, UserRepository>();
            // Add other repositories here
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            // --- Service Registration ---
            services.AddScoped<IUserService, UserService>();
            // Add other services here
        }

        public static void ConfigureValidators(this IServiceCollection services)
        {
            // --- Validator Registration ---
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
        }
    }
}
