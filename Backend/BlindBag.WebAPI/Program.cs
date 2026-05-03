using System.Text;
using BlindBag.Application.Interfaces;
using BlindBag.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Database
builder.Services.AddDbContext<BlindBag.Infrastructure.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSection["Key"]
    ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình trong appsettings.json.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = jwtSection["Issuer"],
        ValidAudience            = jwtSection["Audience"],
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew                = TimeSpan.Zero   // Không cho phép trễ thêm thời gian
    };
});

builder.Services.AddAuthorization();

// Đăng ký Application Services
builder.Services.AddScoped<IAuthService, AuthService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Thực thi Database Seeder
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<BlindBag.Infrastructure.Data.ApplicationDbContext>();
        // Tùy chọn: Chạy tự động update migration nếu quên
        context.Database.Migrate(); 
        await BlindBag.Infrastructure.Data.DbSeeder.SeedAsync(context);
        Console.WriteLine("[Seeder] Thiết lập dữ liệu khởi tạo thành công.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Seeder Error] Đã xảy ra lỗi khởi tạo dữ liệu: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Cấu hình CORS
app.UseCors("AllowFrontend");

// Middleware xác thực và phân quyền (thứ tự quan trọng: Auth trước Authorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
