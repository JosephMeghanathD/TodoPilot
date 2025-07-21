package com.taskpilot.todolistservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AiDecompositionResponse {
    private String task;
    private String context;
    private List<SubtaskDetail> subtasks;

    @JsonProperty("total_estimated_time_hours")
    private float totalEstimatedTimeHours;

    @Data
    public static class SubtaskDetail {
        private String title;
        private String description;

        @JsonProperty("estimated_time_hours")
        private float estimatedTimeHours;
    }
}