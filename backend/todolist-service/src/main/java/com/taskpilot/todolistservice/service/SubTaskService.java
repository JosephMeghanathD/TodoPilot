package com.taskpilot.todolistservice.service;

import com.taskpilot.todolistservice.dto.SubTaskDto;
import com.taskpilot.todolistservice.dto.SubTaskRequestDto;
import com.taskpilot.todolistservice.exception.ResourceNotFoundException;
import com.taskpilot.todolistservice.mappers.SubTaskMapper;
import com.taskpilot.todolistservice.model.SubTask;
import com.taskpilot.todolistservice.model.Task;
import com.taskpilot.todolistservice.repository.SubTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubTaskService {

    @Autowired
    private SubTaskRepository subTaskRepository;

    @Autowired
    private TaskService taskService; 

    @Autowired
    private SubTaskMapper subTaskMapper;

    @Transactional
    public SubTaskDto createSubTask(Long taskId, Long userId, SubTaskRequestDto requestDto) {
        
        Task parentTask = taskService.findTaskByIdAndUserId(taskId, userId);

        return createSubTask(requestDto, parentTask);
    }

    private SubTaskDto createSubTask(SubTaskRequestDto requestDto, Task parentTask) {
        SubTask subTask = new SubTask();
        subTask.setTitle(requestDto.getTitle());
        subTask.setDescription(requestDto.getDescription());
        subTask.setDueDate(requestDto.getDueDate());
        subTask.setTask(parentTask);

        SubTask savedSubTask = subTaskRepository.save(subTask);
        return subTaskMapper.toDto(savedSubTask);
    }

    @Transactional
    public List<SubTaskDto> createBatchSubTask(Long taskId, Long userId, List<SubTaskRequestDto> requestDto) {
        Task parentTask = taskService.findTaskByIdAndUserId(taskId, userId);

        List<SubTaskDto> batchDtoList = new ArrayList<>();
        for (SubTaskRequestDto subTaskRequestDto : requestDto) {
            SubTaskDto subTask = createSubTask(subTaskRequestDto, parentTask);
            batchDtoList.add(subTask);
        }

        return batchDtoList;
    }

    @Transactional
    public SubTaskDto updateSubTask(Long taskId, Long subTaskId, Long userId, SubTaskRequestDto requestDto) {
        SubTask subTask = findSubTaskForUser(taskId, subTaskId, userId);

        subTask.setTitle(requestDto.getTitle());
        subTask.setDueDate(requestDto.getDueDate());

        SubTask updatedSubTask = subTaskRepository.save(subTask);
        return subTaskMapper.toDto(updatedSubTask);
    }

    @Transactional
    public void deleteSubTask(Long taskId, Long subTaskId, Long userId) {
        SubTask subTask = findSubTaskForUser(taskId, subTaskId, userId);
        subTaskRepository.delete(subTask);
    }

    @Transactional
    public SubTaskDto toggleSubTaskCompletion(Long taskId, Long subTaskId, Long userId) {
        SubTask subTask = findSubTaskForUser(taskId, subTaskId, userId);
        subTask.setCompleted(!subTask.isCompleted());
        SubTask updatedSubTask = subTaskRepository.save(subTask);
        return subTaskMapper.toDto(updatedSubTask);
    }

    
    private SubTask findSubTaskForUser(Long taskId, Long subTaskId, Long userId) {
        
        taskService.findTaskByIdAndUserId(taskId, userId);

        
        SubTask subTask = subTaskRepository.findById(subTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with id: " + subTaskId));

        
        
        if (!subTask.getTask().getId().equals(taskId)) {
            throw new ResourceNotFoundException("Subtask with id " + subTaskId + " does not belong to task with id " + taskId);
        }

        return subTask;
    }
}