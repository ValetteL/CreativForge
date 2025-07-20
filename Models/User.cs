namespace CreativForge.Models
{
    public class User
    {
        public int Id { get; set; }
        public string GoogleId { get; set; } = "";
        public string Email { get; set; } = "";
        public ICollection<Brief> Briefs { get; set; } = new List<Brief>();
    }
}