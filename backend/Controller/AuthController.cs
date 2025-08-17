using System.Security.Claims;
using CreativForge.Data;
using CreativForge.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CreativForge.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext db, IConfiguration config, ILogger<AuthController> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }

        /// <summary>
        /// Starts Google OAuth login via server-side challenge.
        /// We accept an optional returnUrl; after successful sign-in we will redirect there.
        /// </summary>
        [HttpGet("google/login")]
        public IActionResult GoogleLogin([FromQuery] string? returnUrl = null)
        {
            // Where to go after a successful login (defaults to frontend root)
            var frontend = _config["Authentication:FrontendUrl"] ?? "http://localhost:3000";
            var target = string.IsNullOrWhiteSpace(returnUrl) ? $"{frontend}/" : returnUrl;

            var props = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleCallback), "Auth", new { returnUrl = target })
            };

            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Google OAuth callback: finalize sign-in, ensure user exists in DB, issue cookie, then redirect to frontend.
        /// </summary>
        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string? returnUrl = null)
        {
            // Authenticate using Google scheme (ticket is available here)
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded || result.Principal is null)
            {
                _logger.LogWarning("Google authentication failed in callback.");
                var frontend = _config["Authentication:FrontendUrl"] ?? "http://localhost:3000";
                return Redirect($"{frontend}/login?error=google_auth_failed");
            }

            var principal = result.Principal;
            var email = principal.FindFirstValue(ClaimTypes.Email);
            var name  = principal.Identity?.Name ?? principal.FindFirstValue("name");
            var googleId = principal.FindFirstValue(ClaimTypes.NameIdentifier); // sub

            if (string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("Google callback without email claim.");
                var frontend = _config["Authentication:FrontendUrl"] ?? "http://localhost:3000";
                return Redirect($"{frontend}/login?error=no_email");
            }

            // Ensure user exists in DB (create or update)
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    GoogleId = googleId,
                    Name = name
                };
                _db.Users.Add(user);
            }
            else
            {
                // Update GoogleId/Name if changed
                var changed = false;
                if (user.GoogleId != googleId) { user.GoogleId = googleId; changed = true; }
                if (!string.Equals(user.Name, name, StringComparison.Ordinal)) { user.Name = name; changed = true; }
                if (changed) _db.Users.Update(user);
            }
            await _db.SaveChangesAsync();

            // Sign-in our own cookie auth using the Google principal
            // You can optionally build your own ClaimsIdentity if you want custom claims.
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                result.Properties
            );

            // Redirect to the frontend (returnUrl if provided)
            var frontendUrl = _config["Authentication:FrontendUrl"] ?? "http://localhost:3000";
            var target = string.IsNullOrWhiteSpace(returnUrl) ? $"{frontendUrl}/" : returnUrl!;
            return Redirect(target);
        }

        /// <summary>
        /// Returns the current authenticated user (from cookie session).
        /// </summary>
        [HttpGet("me")]
        public IActionResult Me()
        {
            if (User?.Identity?.IsAuthenticated == true)
            {
                var email = User.FindFirstValue(ClaimTypes.Email);
                var name  = User.Identity?.Name ?? User.FindFirstValue("name");
                return Ok(new { email, name });
            }
            return Unauthorized();
        }

        /// <summary>
        /// Logs out (clears the auth cookie).
        /// </summary>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return NoContent();
        }
    }
}
