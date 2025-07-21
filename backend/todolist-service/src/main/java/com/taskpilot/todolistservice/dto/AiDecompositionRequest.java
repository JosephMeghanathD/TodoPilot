package com.taskpilot.todolistservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiDecompositionRequest {
    @NotBlank
    private String task;

    private String context;

    @Min(1)
    @JsonProperty("maximum_time_hours")
    private float maximumTimeHours;

    @Min(1)
    @Max(100)
    @JsonProperty("maximum_steps")
    private int maximumSteps;
}