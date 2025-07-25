package com.taskpilot.userservice.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}