package com.taskpilot.todolistservice.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SubTaskDto {
    private Long id;
    private String title;
    private boolean isCompleted;
    private LocalDateTime dueDate;
    private Long taskId; 
}