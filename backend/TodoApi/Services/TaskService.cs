using System.Collections.Concurrent;
using TodoApi.Models;

namespace TodoApi.Services
{
    public class TaskService
    {
        private static readonly ConcurrentDictionary<int, TaskItem> _tasks = new();
        private static int _nextId = 1;
        
        public IEnumerable<TaskItem> GetAll() => _tasks.Values.OrderBy(t => t.Id);

        public TaskItem? GetById(int id) => _tasks.TryGetValue(id, out var task) ? task : null;

        public TaskItem Add(string text)
        {
            var id = Interlocked.Increment(ref _nextId);
            var newTask = new TaskItem { Id = id, Text = text, IsCompleted = false };
            _tasks[id] = newTask;
            return newTask;
        }

        public bool Delete(int id) => _tasks.TryRemove(id, out _);

        public bool Update(int id, string newText, bool newIsCompleted) { 
            if(_tasks.TryGetValue(id, out var task))
            {
                task.Text = newText;
                task.IsCompleted = newIsCompleted;
                return true;
            }
            return false;
        }
    }
}
