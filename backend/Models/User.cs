using System.ComponentModel.DataAnnotations;

namespace CreativForge.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(256)]
        public string? Name { get; set; }

        [Required, MaxLength(256)]
        public string Email { get; set; } = default!;

        [MaxLength(128)]
        public string? GoogleId { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Brief> Briefs { get; set; } = new List<Brief>();
    }
}