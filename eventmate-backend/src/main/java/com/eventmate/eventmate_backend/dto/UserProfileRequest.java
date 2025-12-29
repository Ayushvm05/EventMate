package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String phoneNumber;
    private String bio;
    private String profileImage;
    
    // Optional: For password change
    private String currentPassword;
    private String newPassword;
}