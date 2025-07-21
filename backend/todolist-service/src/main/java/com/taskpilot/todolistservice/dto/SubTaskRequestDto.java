package com.taskpilot.todolistservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubTaskRequestDto {
    @NotBlank(message = "Subtask title cannot be blank.")
    @Size(min = 2, max = 100, message = "Subtask title must be between 2 and 100 characters.")
    private String title;

    private LocalDateTime dueDate;
}