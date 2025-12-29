package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.Review;
import com.eventmate.eventmate_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEventId(Long eventId);
    
    // NEW: Prevent duplicate reviews by same user for same event
    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    // ✅ NEW: Find Reviews for ALL events owned by a specific Organizer
    List<Review> findByEvent_Organizer(User organizer);
}