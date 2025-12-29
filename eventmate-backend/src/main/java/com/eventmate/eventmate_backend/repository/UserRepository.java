package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    // ✅ NEW: Find distinct users who have booked events created by a specific organizer
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN Booking b ON u.id = b.user.id " +
           "JOIN Event e ON b.event.id = e.id " +
           "WHERE e.organizer.id = :organizerId")
    List<User> findCustomersByOrganizerId(@Param("organizerId") Long organizerId);
}