using Microsoft.EntityFrameworkCore;
using ShoppingSystem.Data; 

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add services to the container ---

builder.Services.AddControllers();

// เพิ่มการเชื่อมต่อ Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// เพิ่ม CORS เพื่อให้ Next.js (Port 3000) เรียกใช้งาน API ได้
builder.Services.AddCors(options => {
    options.AddPolicy("AllowNextJS",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 2. Configure the HTTP request pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// วาง UseCors ไว้ก่อน UseAuthorization
app.UseCors("AllowNextJS");

app.UseAuthorization();

app.MapControllers();

app.Run();