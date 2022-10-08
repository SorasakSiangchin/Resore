using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

#region Swagger Config
builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Jwt auth header",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
           {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
        });
    });
#endregion


// builder.Services.AddDbContext<StoreContext>(opt =>
// {
//     // opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
//      opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

#region เชื่อมต่อไปยัง heroku Server และใช้ค่าที่ config ไว้แล้วในฝั่ง Heroku
builder.Services.AddDbContext<StoreContext>(options =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    string connStr;

    if (env == "Development")
    {
        // Use connection string from file.
        connStr = builder.Configuration.GetConnectionString("DefaultConnection");
    }
    else
    {
        // Use connection string provided at runtime by Heroku.
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Parse connection URL to connection string for Npgsql
        connUrl = connUrl.Replace("postgres://", string.Empty);
        var pgUserPass = connUrl.Split("@")[0];
        var pgHostPortDb = connUrl.Split("@")[1];
        var pgHostPort = pgHostPortDb.Split("/")[0];
        var pgDb = pgHostPortDb.Split("/")[1];
        var pgUser = pgUserPass.Split(":")[0];
        var pgPass = pgUserPass.Split(":")[1];
        var pgHost = pgHostPort.Split(":")[0];
        var pgPort = pgHostPort.Split(":")[1];

        connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";
    }

    // Whether the connection string came from the local development configuration file
    // or from the environment variable from Heroku, use it to set up your DbContext.
    options.UseNpgsql(connStr);
});
#endregion


//
#region Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            // policy.AllowAnyHeader()
            // .AllowAnyMethod()
            // .AllowCredentials()
            // .WithOrigins("http://localhost:3000");
        });
});
#endregion

#region Identityสร้างเซอร์วิส User,Role (ระวังการเรียงลำดับ)
builder.Services.AddIdentityCore<User>(opt =>
{
    // จะกำหนด option อะไรบ้าง
    opt.User.RequireUniqueEmail = true;
})
     .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
#endregion

#region Identityสร้างเซอร์วิส User,Role (ระวังการเรียงลำดับ)
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

//ยืนยัน Token ที่ได้รับว่าถูกต้องหรือไม่บนเซิฟเวอร์
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                       .AddJwtBearer(opt =>
                       {
                           opt.TokenValidationParameters = new TokenValidationParameters
                           {
                               ValidateIssuer = false,
                               ValidateAudience = false,
                               ValidateLifetime = true,
                               ValidateIssuerSigningKey = true,
                               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                                   .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                           };
                       });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>(); // ลงทะเบียน stripe
#endregion



var app = builder.Build();

#region  //สร้ำงข้อมูลจำลอง Fake data 
using var scope = app.Services.CreateScope(); //using หลังทำงำนเสร็จจะถูกทลำยจำกMemory 
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    // orm
    await context.Database.MigrateAsync();   //สร้ำง DB ใหอ้ตัโนมตัถิำยังไม่มี ***** ใช้งานได้จริง
    await DbInitializer.Initialize(context, userManager); //สร้ำงข้อมูลสินค้ำจำลอง ยูเซอร์จำลอง
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

#region ส่งerror ไปให ้Axios ตอนทำ Interceptor 
app.UseMiddleware<ExceptionMiddleware>();
#endregion

// ไปที่ Methon ต่างๆได้
app.UseRouting();

app.UseDefaultFiles(); // อนุญาตให้เรียกไฟล์ต่างๆ ใน wwwroot

app.UseStaticFiles();  // อนุญาตให้เข้าถึงไฟล์ค่าคงที่ได้

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

// app.MapControllers();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToController("Index", "Fallback"); // บอกเส้นทางมันก่อน
});

await app.RunAsync();
