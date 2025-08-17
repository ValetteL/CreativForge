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
        public DbSet<Prompt> Prompts => Set<Prompt>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Brief>()
                .HasOne(b => b.Prompt)
                .WithMany(p => p.Briefs)
                .HasForeignKey(b => b.PromptId)
                .OnDelete(DeleteBehavior.SetNull); // Si Prompt supprimé, PromptId devient null
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            foreach (var entry in ChangeTracker.Entries().Where(e => e.State is EntityState.Added or EntityState.Modified))
            {
                if (entry.Property("UpdatedAt") != null) entry.Property("UpdatedAt").CurrentValue = now;
                if (entry.State == EntityState.Added && entry.Property("CreatedAt") != null)
                    entry.Property("CreatedAt").CurrentValue = now;
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}