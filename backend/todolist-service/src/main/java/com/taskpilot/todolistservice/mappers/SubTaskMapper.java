package com.taskpilot.todolistservice.mappers;

import com.taskpilot.todolistservice.dto.SubTaskDto;
import com.taskpilot.todolistservice.model.SubTask;
import org.springframework.stereotype.Component;

@Component
public class SubTaskMapper {

    public SubTaskDto toDto(SubTask subTask) {
        if (subTask == null) {
            return null;
        }
        return SubTaskDto.builder()
                .id(subTask.getId())
                .title(subTask.getTitle())
                .isCompleted(subTask.isCompleted())
                .dueDate(subTask.getDueDate())
                .taskId(subTask.getTask().getId())
                .build();
    }
}