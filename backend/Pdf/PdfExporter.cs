using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using CreativForge.Models;

namespace CreativForge.Pdf
{
    public class PdfExporter
    {
        public byte[] ExportBriefToPdf(Brief brief)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);

                    page.Content().Column(col =>
                    {
                        col.Item().Text("Creative Brief").FontSize(20).Bold().FontColor("#6e0719");
                        col.Item().Text($"Title: {brief.Title}").FontSize(14).Bold();
                        col.Item().Text($"Objective: {brief.Objective}").FontSize(12);
                        col.Item().Text($"Audience: {brief.Audience}").FontSize(12);
                        col.Item().Text($"Platform: {brief.Platform}").FontSize(12);
                    });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] ExportPlanToPdf(Planning plan)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);

                    page.Content().Column(col =>
                    {
                        col.Item().Text("Project Plan").FontSize(20).Bold().FontColor("#6e0719");
                        col.Item().Text($"Project: {plan.ProjectName}").FontSize(14).Bold();
                        col.Item().Text($"From {plan.StartDate:dd/MM/yyyy} to {plan.EndDate:dd/MM/yyyy}").FontSize(12);
                        col.Item().Text("Steps:").FontSize(12).Bold();
                        foreach (var task in plan.Tasks)
                        {
                            col.Item().Text($"• {task}").FontSize(11);
                        }
                    });
                });
            });

            return document.GeneratePdf();
        }
    }
}
