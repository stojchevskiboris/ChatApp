using ChatApp.Server.Configs;
using ChatApp.Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Section ---
builder.Services.AddDbContext<ChatAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("devDb")));

// --- AutoMapper Configuration ---
//builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// --- Repository Registration ---
builder.Services.ConfigureRepositories();

// --- Service Registration ---
builder.Services.ConfigureServices();

// --- Validators Registration ---
builder.Services.ConfigureValidators();

// --- Controllers Registration ---
builder.Services.AddControllers();

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

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

// --- Run the Application ---
app.Run();
