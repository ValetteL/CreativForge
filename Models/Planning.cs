namespace CreativForge.Models
{
    public class Planning
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProjectName { get; set; }
        public List<string> Tasks { get; set; } = new();
        public DateTime StartDate { get; set; } = DateTime.Today;
        public DateTime EndDate { get; set; } = DateTime.Today.AddDays(30);
    }
}
