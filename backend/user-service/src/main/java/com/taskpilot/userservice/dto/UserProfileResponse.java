package com.taskpilot.userservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
}
