package com.eventmate.eventmate_backend.scheduler;

import com.eventmate.eventmate_backend.model.SeatStatus;
import com.eventmate.eventmate_backend.repository.SeatStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SeatUnlockScheduler {

    @Autowired
    private SeatStatusRepository seatStatusRepository;

    @Scheduled(fixedRate = 60000) // Run every 1 minute
    public void unlockExpiredSeats() {
        // Find seats that are LOCKED and their time has passed
        List<SeatStatus> expired = seatStatusRepository.findByStatusAndLockExpiresAtBefore(
                SeatStatus.Status.LOCKED, LocalDateTime.now());

        for (SeatStatus seat : expired) {
            seat.setStatus(SeatStatus.Status.AVAILABLE);
            seat.setLockedByUserId(null);
            seat.setLockExpiresAt(null);
            // Don't forget to save the changes!
            seatStatusRepository.save(seat);
        }
        
        if (!expired.isEmpty()) {
            System.out.println("🔓 Released " + expired.size() + " expired seats.");
        }
    }
}