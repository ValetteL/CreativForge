namespace CreativForge.Models
{
    public class Planning
    {
        public int Id { get; set; }
        public string ProjectName { get; set; }
        public List<string> Tasks { get; set; } = new();
        public DateTime StartDate { get; set; } = DateTime.Today;
        public DateTime EndDate { get; set; } = DateTime.Today.AddDays(30);
    }
}
