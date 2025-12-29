package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role; // Frontend sends "User" or "Organizer"
}