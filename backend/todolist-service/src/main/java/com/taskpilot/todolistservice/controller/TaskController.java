package com.taskpilot.todolistservice.controller;

import com.taskpilot.todolistservice.dto.TaskDto;
import com.taskpilot.todolistservice.dto.TaskRequestDto;
import com.taskpilot.todolistservice.security.JwtUtil;
import com.taskpilot.todolistservice.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromAuthentication(Authentication authentication) {
        String token = (String) authentication.getCredentials();
        return jwtUtil.getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskRequestDto requestDto, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        TaskDto createdTask = taskService.createTask(requestDto, userId);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<TaskDto> tasks = taskService.getAllTasksForUser(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        TaskDto task = taskService.getTaskById(id, userId);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequestDto requestDto, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        TaskDto updatedTask = taskService.updateTask(id, requestDto, userId);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-complete")
    public ResponseEntity<TaskDto> toggleTaskCompletion(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        TaskDto updatedTask = taskService.toggleTaskCompletion(id, userId);
        return ResponseEntity.ok(updatedTask);
    }
}