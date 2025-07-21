package com.taskpilot.todolistservice.controller;

import com.taskpilot.todolistservice.dto.AiDecompositionRequest;
import com.taskpilot.todolistservice.dto.AiDecompositionResponse;
import com.taskpilot.todolistservice.service.AiDecompositionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    @Autowired
    private AiDecompositionService aiDecompositionService;

    @PostMapping("/decompose-task")
    public ResponseEntity<?> decomposeTask(
            @Valid @RequestBody AiDecompositionRequest request,
            Authentication authentication) { // Authentication ensures only logged-in users can use this
        try {
            AiDecompositionResponse response = aiDecompositionService.decomposeTask(request);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            // Provide a more user-friendly error response
            return ResponseEntity.internalServerError().body("Error communicating with AI service: " + e.getMessage());
        }
    }
}