using ChatApp.Server.Data.Implementations;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Validators;
using FluentValidation;
using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;
using Microsoft.OpenApi.Models;

namespace ChatApp.Server.Configs
{
    public static class StartConfig
    {
        public static void ConfigureRepositories(this IServiceCollection services)
        {
            // --- Repository Registration ---
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<IGroupUserRepository, GroupUserRepository>();
            services.AddScoped<IRequestRepository, RequestRepository>();
            services.AddScoped<IMediaRepository, MediaRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IRecipientRepository, RecipientRepository>();
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            // --- Service Registration ---
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IGiphyService, GiphyService>();
            services.AddScoped<IGroupUserService, GroupUserService>();
            services.AddScoped<IRequestService, RequestService>();
            services.AddScoped<IMessageService, MessageService>();

            services.AddHttpClient<IGiphyService, GiphyService>();
            services.AddHttpContextAccessor();

            services.AddSingleton<IFirebaseStorageService>(s => new FirebaseStorageService(StorageClient.Create()));
        }

        public static void ConfigureValidators(this IServiceCollection services)
        {
            // --- Validator Registration ---
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
        }

        public static void ConfigureCors(this IServiceCollection services)
        {
            // --- Cross-origin resource sharing ---
            var AllowAngularApp = "AllowAngularApp";

            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowAngularApp,
                                  policy =>
                                  {
                                      policy.WithOrigins(
                                          "https://localhost:4200",
                                          "http://localhost:4200",
                                          "https://127.0.0.1:4200",
                                          "http://127.0.0.1:4200")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                                  });
            });
        }

        public static void ConfigureSwaggerAuth(this IServiceCollection services)
        {
            services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "JWT Token Authentication API",
                    Description = ".NET 8 Web API"
                });
                // To Enable authorization using Swagger (JWT)
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. " +
                    "\r\n\r\n Enter 'Bearer' [space] and then your token in the text input below." +
                    "\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });
        }
    }
}
