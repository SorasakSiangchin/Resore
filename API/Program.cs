using API.Data;
using Microsoft.EntityFrameworkCore; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<StoreContext>(opt=>{ 
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")); 
}); 

var app = builder.Build();

#region  //สร้ำงข้อมูลจำลอง Fake data 
        using var scope = app.Services.CreateScope(); //using หลังทำงำนเสร็จจะถูกทลำยจำกMemory 
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>(); 
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); 
        try 
        { 
            // orm
            await context.Database.MigrateAsync();   //สร้ำง DB ใหอ้ตัโนมตัถิำยังไม่มี
            await DbInitializer.Initialize(context); //สร้ำงข้อมูลสินค้ำจำลอง 
        } 
        catch (Exception ex) 
        { 
            logger.LogError(ex, "Problem migrating data"); 
        } 
#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// ใช้กับพวก Web
//app.UseHttpsRedirection();

// ไปที่ Methon ต่างๆได้
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
