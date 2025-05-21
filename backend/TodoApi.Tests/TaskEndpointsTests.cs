namespace TodoApi.Tests;

using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing; 
using TodoApi.Models;

public record CreateTaskDto(string Text);
public record UpdateTaskDto(string? Text, bool? IsCompleted);

public class TaskEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public TaskEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();     
    }

    [Fact]
    public async Task GetTasks_ReturnsOkAndListOfTasks()
    {
        var response = await _client.GetAsync("/api/tasks");

        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItem>>();
        Assert.NotNull(tasks);

    }

    [Fact]
    public async Task PostTask_CreatesAndReturnsTask()
    {
        var newTaskDto = new CreateTaskDto("New Task From Test");
        var response = await _client.PostAsJsonAsync("/api/tasks", newTaskDto);
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode); 

        var createdTask = await response.Content.ReadFromJsonAsync<TaskItem>();
        Assert.NotNull(createdTask);
        Assert.Equal(newTaskDto.Text, createdTask.Text);
        Assert.False(createdTask.IsCompleted);
        Assert.True(createdTask.Id > 0); 

        Assert.NotNull(response.Headers.Location);
        Assert.Equal($"/api/tasks/{createdTask.Id}", response.Headers.Location.OriginalString);
    }

    [Fact]
    public async Task PostTask_WithEmptyText_ReturnsBadRequest()
    {
        var newTaskDto = new CreateTaskDto(" ");
        var response = await _client.PostAsJsonAsync("/api/tasks", newTaskDto);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }


    [Fact]
    public async Task GetTaskById_ReturnsNotFound_ForInvalidId()
    {
        var response = await _client.GetAsync("/api/tasks/9999"); 


        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTask_RemovesTaskAndReturnsNoContent()
    {

        var taskToCreate = new CreateTaskDto("Task to Delete");
        var postResponse = await _client.PostAsJsonAsync("/api/tasks", taskToCreate);
        postResponse.EnsureSuccessStatusCode();
        var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();
        Assert.NotNull(createdTask);


        var deleteResponse = await _client.DeleteAsync($"/api/tasks/{createdTask.Id}");

        deleteResponse.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode); 

 
        var getResponse = await _client.GetAsync($"/api/tasks/{createdTask.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }


    [Fact]
    public async Task DeleteTask_ReturnsNotFound_ForInvalidId()
    {
        var response = await _client.DeleteAsync("/api/tasks/9999"); 

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }


    [Fact]
    public async Task PutTask_UpdatesTaskAndReturnsOk()
    {
        var taskToCreate = new CreateTaskDto("Task to Update");
        var postResponse = await _client.PostAsJsonAsync("/api/tasks", taskToCreate);
        postResponse.EnsureSuccessStatusCode();
        var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();
        Assert.NotNull(createdTask);

        var updatePayload = new UpdateTaskDto("Updated Task Text", true);

        var putResponse = await _client.PutAsJsonAsync($"/api/tasks/{createdTask.Id}", updatePayload);

        putResponse.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, putResponse.StatusCode);

        var updatedTask = await putResponse.Content.ReadFromJsonAsync<TaskItem>();
        Assert.NotNull(updatedTask);
        Assert.Equal(updatePayload.Text, updatedTask.Text);
        Assert.Equal(updatePayload.IsCompleted, updatedTask.IsCompleted);
        Assert.Equal(createdTask.Id, updatedTask.Id);
    }

    [Fact]
    public async Task PutTask_WithEmptyText_ReturnsBadRequest()
    {

        var taskToCreate = new CreateTaskDto("Task for Bad Update");
        var postResponse = await _client.PostAsJsonAsync("/api/tasks", taskToCreate);
        postResponse.EnsureSuccessStatusCode();
        var createdTask = await postResponse.Content.ReadFromJsonAsync<TaskItem>();
        Assert.NotNull(createdTask);

        var updatePayload = new UpdateTaskDto("  ", false); 


        var putResponse = await _client.PutAsJsonAsync($"/api/tasks/{createdTask.Id}", updatePayload);

        Assert.Equal(HttpStatusCode.BadRequest, putResponse.StatusCode);
    }

    [Fact]
    public async Task PutTask_ReturnsNotFound_ForInvalidId()
    {

        var updatePayload = new UpdateTaskDto("Non Existent Task", false);


        var response = await _client.PutAsJsonAsync("/api/tasks/9999", updatePayload); 


        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}