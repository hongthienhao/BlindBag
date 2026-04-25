using Microsoft.EntityFrameworkCore;

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

app.MapControllers();

app.Run();
