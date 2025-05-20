namespace TodoApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string? Text { get; set; }

        public bool IsCompleted { get; set; }
    }
}
