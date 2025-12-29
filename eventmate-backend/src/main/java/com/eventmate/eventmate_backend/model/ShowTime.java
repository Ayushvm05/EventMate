package com.eventmate.eventmate_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "showtimes")
@Data
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // ✅ NEW: Link to Hall (Optional)
    // If null -> It's a normal event (old logic)
    // If set -> It's a movie show in this specific hall
    @ManyToOne
    @JoinColumn(name = "hall_id", nullable = true)
    private Hall hall;

    private LocalDate showDate;
    private LocalTime showTime;

    // Snapshot of configuration (in case event changes later)
    private boolean isSeated; 
    
    // For General Admission: Track capacity per show
    private Integer availableGeneralTickets; 
}