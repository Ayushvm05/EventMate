package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.Booking;
import com.eventmate.eventmate_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByEvent_Organizer(User organizer);

    List<Booking> findByEventId(Long eventId);

    // ✅ STRICT ISOLATION QUERY (REQUIRED)
    @Query("""
        SELECT b FROM Booking b 
        WHERE b.event.id = :eventId 
        AND b.event.organizer = :organizer
    """)
    List<Booking> findByEventIdAndOrganizer(
        @Param("eventId") Long eventId,
        @Param("organizer") User organizer
    );

    // For Scheduler
    List<Booking> findByStatusAndBookingDateBefore(String status, LocalDateTime expiryTime);

    // For Security
    long countByUserAndStatus(User user, String status);

    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, String status);

    // ✅ Recent Bookings Query
    @Query("SELECT b FROM Booking b WHERE b.event.organizer = :organizer ORDER BY b.id DESC")
    List<Booking> findRecentBookingsByOrganizer(@Param("organizer") User organizer, Pageable pageable);

    // ✅ NEW: Find Bookings for a specific Showtime (for Movie Seat Map)
    // Ignores CANCELLED bookings so those seats become free again.
    List<Booking> findByShowTimeIdAndStatusNot(Long showTimeId, String status);

    // ✅ NEW: Find Bookings for a standard event (Backward Compatibility)
    List<Booking> findByEventIdAndStatusNot(Long eventId, String status);
}