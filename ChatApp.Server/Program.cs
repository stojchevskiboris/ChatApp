using ChatApp.Server.Common.Constants;
using ChatApp.Server.Configs;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Configs.Authentication.Models;
using ChatApp.Server.Data;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Section ---
AppParameters.ConnectionString = builder.Configuration.GetConnectionString("devDb");
builder.Services.AddDbContext<ChatAppDbContext>(options =>
    options.UseSqlServer(AppParameters.ConnectionString));

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// --- Repository Registration ---
builder.Services.ConfigureRepositories();

// --- Service Registration ---
builder.Services.ConfigureServices();

// --- Validators Registration ---
builder.Services.ConfigureValidators();

// --- Cors Configuration  ---
builder.Services.ConfigureCors();

// --- Swagger Dev Authorization ---
builder.Services.ConfigureSwaggerAuth();

// --- Controllers Registration ---
builder.Services.AddControllers();

// --- Serilog Configuration ---
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext() // Enrich logs with additional context data
        .WriteTo.Console() // Log to the console
        .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));

// --- Swagger Configuration ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ChatAppDbContext>();
    dbContext.Database.Migrate(); // dotnet ef database update
}

// --- Middleware Configuration --- 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        if (exceptionHandlerPathFeature?.Error != null)
        {
            Log.Error(exceptionHandlerPathFeature.Error, "Unhandled exception occurred.");
        }
        context.Response.StatusCode = 500; // Internal Server Error
        await context.Response.WriteAsync("An unexpected fault happened. Try again later.");
    });
});

Context.Configure(app.Services.GetRequiredService<IHttpContextAccessor>());
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseSerilogRequestLogging();
app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.UseMiddleware<JwtMiddleware>();
app.MapControllers();
app.MapFallbackToFile("/index.html");

// --- Run the Application ---
app.Run();
