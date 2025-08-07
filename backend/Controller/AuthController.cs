using CreativForge.Data;
using CreativForge.Models;
using CreativForge.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CreativForge.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext db, TokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody] GoogleLoginDto dto)
        {
            // 1. Validate Google JWT token
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.Credential);
            }
            catch
            {
                return Unauthorized("Invalid Google token");
            }

            // 2. Find or create the user
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    GoogleId = payload.Subject
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }
            else
            {
                user.GoogleId = payload.Subject; // update GoogleId if needed
                await _db.SaveChangesAsync();
            }

            // 3. Issue backend JWT
            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new { user.Id, user.Email }
            });
        }
    }
}

public class GoogleLoginDto
{
    public string Credential { get; set; }
}
