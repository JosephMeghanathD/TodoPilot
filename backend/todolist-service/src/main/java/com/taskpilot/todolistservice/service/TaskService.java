package com.taskpilot.todolistservice.service;

import com.taskpilot.todolistservice.dto.SubTaskDto;
import com.taskpilot.todolistservice.dto.TaskDto;
import com.taskpilot.todolistservice.dto.TaskRequestDto;
import com.taskpilot.todolistservice.exception.ResourceNotFoundException;
import com.taskpilot.todolistservice.mappers.CategoryMapper;
import com.taskpilot.todolistservice.mappers.SubTaskMapper;
import com.taskpilot.todolistservice.model.Category;
import com.taskpilot.todolistservice.model.Task;
import com.taskpilot.todolistservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private SubTaskMapper subTaskMapper;

    @Transactional
    public TaskDto createTask(TaskRequestDto requestDto, Long userId) {
        Category category = null;
        if (requestDto.getCategoryId() != null) {
            category = categoryService.findCategoryByIdAndUserId(requestDto.getCategoryId(), userId);
        }

        Task task = new Task();
        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setPriority(requestDto.getPriority());
        task.setDueDate(requestDto.getDueDate());
        task.setCategory(category);
        task.setUserId(userId);

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasksForUser(Long userId) {
        return taskRepository.findByUserIdOrderByPriorityDescDueDateAsc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long taskId, Long userId) {
        Task task = findTaskByIdAndUserId(taskId, userId);
        return mapToDto(task);
    }

    @Transactional
    public TaskDto updateTask(Long taskId, TaskRequestDto requestDto, Long userId) {
        Task taskToUpdate = findTaskByIdAndUserId(taskId, userId);

        Category category = null;
        if (requestDto.getCategoryId() != null) {
            category = categoryService.findCategoryByIdAndUserId(requestDto.getCategoryId(), userId);
        }
        taskToUpdate.setCategory(category);

        taskToUpdate.setTitle(requestDto.getTitle());
        taskToUpdate.setDescription(requestDto.getDescription());
        taskToUpdate.setPriority(requestDto.getPriority());
        taskToUpdate.setDueDate(requestDto.getDueDate());

        Task updatedTask = taskRepository.save(taskToUpdate);
        return mapToDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task taskToDelete = findTaskByIdAndUserId(taskId, userId);
        taskRepository.delete(taskToDelete);
    }

    @Transactional
    public TaskDto toggleTaskCompletion(Long taskId, Long userId) {
        Task taskToToggle = findTaskByIdAndUserId(taskId, userId);
        taskToToggle.setCompleted(!taskToToggle.isCompleted());
        Task updatedTask = taskRepository.save(taskToToggle);
        return mapToDto(updatedTask);
    }

    public Task findTaskByIdAndUserId(Long taskId, Long userId) {
        return taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    private TaskDto mapToDto(Task task) {
        List<SubTaskDto> subTaskDtos = task.getSubTasks().stream()
                .map(subTaskMapper::toDto)
                .collect(Collectors.toList());

        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .isCompleted(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .category(categoryMapper.toDto(task.getCategory()))
                .subTasks(subTaskDtos)
                .build();
    }
}