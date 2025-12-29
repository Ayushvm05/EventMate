package com.eventmate.eventmate_backend.service;

import com.eventmate.eventmate_backend.model.Hall;
import com.eventmate.eventmate_backend.model.User;
import com.eventmate.eventmate_backend.repository.HallRepository;
import com.eventmate.eventmate_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HallService {

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private UserRepository userRepository;

    public Hall createHall(Hall hall, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        hall.setOrganizer(organizer);
        
        // Auto-calculate capacity if not provided
        if (hall.getTotalCapacity() == null && hall.getTotalRows() != null && hall.getTotalCols() != null) {
            hall.setTotalCapacity(hall.getTotalRows() * hall.getTotalCols());
        }
        
        return hallRepository.save(hall);
    }

    public List<Hall> getMyHalls(String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        return hallRepository.findByOrganizer(organizer);
    }
}