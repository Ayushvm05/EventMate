package com.eventmate.eventmate_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "halls")
@Data
public class Hall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Screen 1", "IMAX Hall"

    // Only the organizer who created it can use it
    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    // Physical Layout of the Hall
    private Integer totalRows;
    private Integer totalCols;
    private Integer totalCapacity;

    // Stores class mapping (e.g., Row A-D = Silver, E-H = Gold)
    @Column(length = 1000)
    private String seatConfig; 
}