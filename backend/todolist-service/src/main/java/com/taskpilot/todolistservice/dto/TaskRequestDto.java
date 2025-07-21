package com.taskpilot.todolistservice.dto;

import com.taskpilot.todolistservice.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskRequestDto {

    @NotBlank(message = "Task title cannot be blank.")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    private String description;

    private Priority priority = Priority.NONE;

    private LocalDateTime dueDate;

    private Long categoryId; 
}