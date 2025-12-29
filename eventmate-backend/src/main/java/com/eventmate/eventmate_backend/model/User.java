package com.eventmate.eventmate_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phoneNumber;
    private String role; 

    @Column(length = 1000)
    private String bio; 
    
    // ✅ CHANGED: Added @Lob to allow storing large Base64 Image strings
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage; 

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private Set<Event> favorites = new HashSet<>();
}