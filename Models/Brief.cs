namespace CreativForge.Models
{
    public class Brief
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; }
        public string Objective { get; set; }
        public string Audience { get; set; }
        public string Platform { get; set; }
    }
}
