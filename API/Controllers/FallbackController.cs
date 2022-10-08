using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // อนุญาตให้ไครก็ได้เข้ามาใช้
    [AllowAnonymous]
    public class FallbackController : BaseApiController
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
                "text/HTML");
        }
    }

}