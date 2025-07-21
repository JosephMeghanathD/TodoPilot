package com.taskpilot.todolistservice.dto;

import com.taskpilot.todolistservice.model.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private LocalDateTime dueDate;
    private boolean isCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CategoryDto category;
     private List<SubTaskDto> subTasks;
}