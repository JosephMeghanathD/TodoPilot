package com.taskpilot.todolistservice.controller;

import com.taskpilot.todolistservice.dto.SubTaskDto;
import com.taskpilot.todolistservice.dto.SubTaskRequestDto;
import com.taskpilot.todolistservice.security.JwtUtil;
import com.taskpilot.todolistservice.service.SubTaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/subtasks")
public class SubTaskController {

    @Autowired
    private SubTaskService subTaskService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        String token = (String) authentication.getCredentials();
        return jwtUtil.getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    @PostMapping
    public ResponseEntity<SubTaskDto> createSubTask(
            @PathVariable Long taskId,
            @Valid @RequestBody SubTaskRequestDto requestDto,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        SubTaskDto createdSubTask = subTaskService.createSubTask(taskId, userId, requestDto);
        return new ResponseEntity<>(createdSubTask, HttpStatus.CREATED);
    }

    @PutMapping("/{subTaskId}")
    public ResponseEntity<SubTaskDto> updateSubTask(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            @Valid @RequestBody SubTaskRequestDto requestDto,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        SubTaskDto updatedSubTask = subTaskService.updateSubTask(taskId, subTaskId, userId, requestDto);
        return ResponseEntity.ok(updatedSubTask);
    }

    @DeleteMapping("/{subTaskId}")
    public ResponseEntity<Void> deleteSubTask(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        subTaskService.deleteSubTask(taskId, subTaskId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{subTaskId}/toggle-complete")
    public ResponseEntity<SubTaskDto> toggleSubTaskCompletion(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        SubTaskDto updatedSubTask = subTaskService.toggleSubTaskCompletion(taskId, subTaskId, userId);
        return ResponseEntity.ok(updatedSubTask);
    }
}