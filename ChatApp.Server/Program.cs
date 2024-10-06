using ChatApp.Server.Data;
using ChatApp.Server.Data.Implementations;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Section ---
builder.Services.AddDbContext<ChatAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("devDb")));


// --- AutoMapper Configuration ---
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// --- Repository Registration ---
builder.Services.AddScoped<IUserRepository, UserRepository>();

// --- Service Registration ---
builder.Services.AddScoped<IUserService, UserService>();

// --- Controllers Registration ---
builder.Services.AddControllers();

// --- Swagger Configuration ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// test if the db is created and valid
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ChatAppDbContext>();
    dbContext.Database.Migrate(); // Apply any pending migrations
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
