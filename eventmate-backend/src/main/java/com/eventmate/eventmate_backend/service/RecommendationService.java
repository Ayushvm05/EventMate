package com.eventmate.eventmate_backend.service;

import com.eventmate.eventmate_backend.model.Booking;
import com.eventmate.eventmate_backend.model.Event;
import com.eventmate.eventmate_backend.model.User;
import com.eventmate.eventmate_backend.repository.BookingRepository;
import com.eventmate.eventmate_backend.repository.EventRepository;
import com.eventmate.eventmate_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Event> getRecommendations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Get User's Past Bookings
        List<Booking> userBookings = bookingRepository.findByUserId(user.getId());

        if (userBookings.isEmpty()) {
            // Fallback: If no history, return generic upcoming events
            return eventRepository.findAll().stream()
                    .limit(6) // Limit to 6 items
                    .collect(Collectors.toList());
        }

        // 2. Find Favorite Category
        // Count occurrences of each category in past bookings
        Map<String, Long> categoryCount = userBookings.stream()
                .map(b -> b.getEvent().getCategory())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()));

        // Find the category with the highest count
        String favoriteCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // 3. Fetch Events in that Category (excluding ones they already booked)
        if (favoriteCategory != null) {
            // Note: This relies on a derived query in EventRepository (see Step 3 below)
            List<Event> recommendations = eventRepository.findByCategory(favoriteCategory);
            
            // Filter out events they already booked
            List<Long> bookedEventIds = userBookings.stream()
                    .map(b -> b.getEvent().getId())
                    .collect(Collectors.toList());

            return recommendations.stream()
                    .filter(e -> !bookedEventIds.contains(e.getId()))
                    .limit(6)
                    .collect(Collectors.toList());
        }

        return List.of();
    }
}