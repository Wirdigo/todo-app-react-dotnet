using Microsoft.AspNetCore.Mvc;
using TodoApi.Services;

namespace TodoApi
{
    public class Program
    {
        public record CreateTaskDto(string Text);   
        public record UpdateTaskDto(string? Text, bool? IsCompleted);

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddSingleton<TaskService>();

            builder.Services.AddCors(option =>
            {
                option.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });
            });

            var app = builder.Build();

            app.UseCors("AllowReactApp");

            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            app.MapGet("/api/tasks", (TaskService service) =>
            {
                return Results.Ok(service.GetAll());
            });

            app.MapGet("/api/tasks/{id}", (int id, TaskService service) =>
            {
                var task = service.GetById(id);
                return task is not null ? Results.Ok(task) : Results.NotFound();
            });

            app.MapPost("/api/tasks", (CreateTaskDto taskDto, TaskService service) =>
            {
                if (string.IsNullOrWhiteSpace(taskDto.Text))
                {
                    return Results.BadRequest("Task text cannot be empty.");
                }
                var createdTask = service.Add(taskDto.Text);
                return Results.Created($"/api/tasks/{createdTask.Id}", createdTask);
            });

            app.MapPut("/api/tasks/{id}", (int id, UpdateTaskDto taskDto, TaskService service) =>
            {
                var existingTask = service.GetById(id);
                if (existingTask is null)
                {
                    return Results.NotFound($"Task with id {id} not found");
                }

                string newText = taskDto.Text ?? existingTask.Text!;
                if (taskDto.Text != null && string.IsNullOrWhiteSpace(taskDto.Text))
                {
                    return Results.BadRequest("Task text cannot be empty if provided for update");
                }
                bool newIsCompleted = taskDto.IsCompleted ?? existingTask.IsCompleted;

                if (service.Update(id, newText, newIsCompleted))
                {
                    return Results.Ok(service.GetById(id));
                }

                return Results.Problem("Error updating task.", statusCode: 500);
            });

            app.MapDelete("/api/tasks/{id}", (int id, TaskService service) =>
            {
                if (service.Delete(id))
                {
                    return Results.NoContent();
                }
                return Results.NotFound($"Task with id {id} not found");
            });

            app.Run();
        }
    }
}
