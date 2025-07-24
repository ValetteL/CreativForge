namespace CreativForge.Models
{
    public class Brief
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Objective { get; set; } = "";
    public string Audience { get; set; } = "";
    public string Platform { get; set; } = "";

    public int UserId { get; set; }
    public User User { get; set; }

    public int? PromptId { get; set; }
    public Prompt? Prompt { get; set; }
}

}
