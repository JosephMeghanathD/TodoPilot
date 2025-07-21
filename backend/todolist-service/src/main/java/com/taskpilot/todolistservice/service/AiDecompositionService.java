package com.taskpilot.todolistservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Models;
import com.google.genai.types.GenerateContentResponse;
import com.taskpilot.todolistservice.dto.AiDecompositionRequest;
import com.taskpilot.todolistservice.dto.AiDecompositionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Objects;

@Service
public class AiDecompositionService {

    @Autowired
    private Models genAiClient;

    @Autowired
    private ObjectMapper objectMapper;

    public AiDecompositionResponse decomposeTask(AiDecompositionRequest request) throws IOException {
        String prompt = buildPrompt(request);

        GenerateContentResponse generateContentResponse = genAiClient.generateContent(
                "gemini-2.5-flash",
                prompt,
                null);

        String cleanedJson = cleanJsonResponse(Objects.requireNonNull(generateContentResponse.text()));

        try {
            return objectMapper.readValue(cleanedJson, AiDecompositionResponse.class);
        } catch (Exception e) {
            throw new IOException("Failed to parse AI response into JSON: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AiDecompositionRequest request) {
        // Using a text block for readability
        return String.format("""
                    You are a task decomposition assistant.
                    You will receive a JSON object with the following keys:
                
                    * `task`: a string describing the overall task
                    * `context`: a string giving more information about the situation or purpose of the task
                    * `maximum_time_hours`: the total time allowed to complete the task (in hours)
                    * `maximum_steps`: the maximum number of subtasks you are allowed to break the task into
                
                    Your job is to break the task down into a sequence of subtasks, each with:
                
                    * a clear and specific description
                    * a realistic time estimate in hours
                
                    Make sure:
                
                    * The total estimated time does **not exceed** the `maximum_time_hours`.
                    * The number of subtasks does **not exceed** the `maximum_steps`.
                    * Subtasks are logically ordered and relevant to the provided context.
                
                    Respond in the following **strict JSON format**:
                
                    ```json
                    {
                      "task": "<original_task>",
                      "context": "<original_context>",
                      "subtasks": [
                        {
                          "title": "<subtask_Title>",
                          "description": "<subtask_description>",
                          "estimated_time_hours": <float>
                        }
                      ],
                      "total_estimated_time_hours": <float>
                    }
                    ```
                
                    Here is the task to decompose:
                
                    {
                        "task": "%s",
                        "context": "%s",
                        "maximum_time_hours": %f,
                        "maximum_steps": %d
                    }
                """, request.getTask(), request.getContext(), request.getMaximumTimeHours(), request.getMaximumSteps());
    }

    private String cleanJsonResponse(String responseText) {
        // Find the start and end of the JSON block
        int jsonStart = responseText.indexOf("{");
        int jsonEnd = responseText.lastIndexOf("}");

        if (jsonStart != -1 && jsonEnd != -1) {
            return responseText.substring(jsonStart, jsonEnd + 1);
        }

        // Return original text if it's not wrapped
        return responseText;
    }
}