package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // We can add methods like findByBookingId if needed later
}