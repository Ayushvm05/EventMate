package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.Hall;
import com.eventmate.eventmate_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HallRepository extends JpaRepository<Hall, Long> {
    // Fetch all halls belonging to a specific organizer
    List<Hall> findByOrganizer(User organizer);
}