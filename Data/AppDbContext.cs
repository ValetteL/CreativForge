using Microsoft.EntityFrameworkCore;
using CreativForge.Models;

namespace CreativForge.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Brief> Briefs => Set<Brief>();
    }
}