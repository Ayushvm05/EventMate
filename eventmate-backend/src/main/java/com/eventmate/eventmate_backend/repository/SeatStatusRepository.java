package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SeatStatusRepository extends JpaRepository<SeatStatus, Long> {
    
    // Find all seats for a specific showtime
    List<SeatStatus> findByShowTimeId(Long showTimeId);
    
    // Find specific seat (e.g., "A1") in a showtime
    SeatStatus findByShowTimeIdAndSeatLabel(Long showTimeId, String seatLabel);

    // Find expired locks to clean them up
    List<SeatStatus> findByStatusAndLockExpiresAtBefore(SeatStatus.Status status, LocalDateTime now);
}