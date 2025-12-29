package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    // Find all showtimes for a specific event
    List<ShowTime> findByEventId(Long eventId);

    // ✅ NEW: Find schedule for a specific Hall (Screen)
    // Essential for checking if a screen is free before adding a movie show
    List<ShowTime> findByHallId(Long hallId);
}