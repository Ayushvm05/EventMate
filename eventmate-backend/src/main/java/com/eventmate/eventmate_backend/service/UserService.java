package com.eventmate.eventmate_backend.service;

import com.eventmate.eventmate_backend.dto.RegisterRequest;
import com.eventmate.eventmate_backend.dto.UserProfileRequest; // ✅ Import this
import com.eventmate.eventmate_backend.model.Event; // ✅ Import this
import com.eventmate.eventmate_backend.model.User;
import java.util.Set; // ✅ Import this

public interface UserService {
    
    User registerUser(RegisterRequest request);

    // ✅ Add these missing definitions to remove the red lines
    User getUserProfile(String email);
    
    User updateUserProfile(String email, UserProfileRequest request);
    
    void addFavorite(String email, Long eventId);
    
    void removeFavorite(String email, Long eventId);
    
    Set<Event> getFavorites(String email);

    void blockUser(Long userId);

    void unblockUser(Long userId);
}