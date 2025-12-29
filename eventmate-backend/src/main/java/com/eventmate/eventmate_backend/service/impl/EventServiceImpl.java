package com.eventmate.eventmate_backend.service.impl;

import com.eventmate.eventmate_backend.dto.EventRequest;
import com.eventmate.eventmate_backend.model.Event;
import com.eventmate.eventmate_backend.model.User;
import com.eventmate.eventmate_backend.repository.EventRepository;
import com.eventmate.eventmate_backend.repository.UserRepository;
import com.eventmate.eventmate_backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder; 
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Event createEvent(EventRequest request, String userEmail) {
        User organizer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLocation(request.getLocation());
        event.setImageUrl(request.getImageUrl());
        
        // ✅ NEW: Handle Event Type (Default to NORMAL if missing)
        // If Request doesn't have eventType, assume NORMAL for backward compatibility
        if (request.getEventType() != null) {
             try {
                 event.setEventType(Event.EventType.valueOf(request.getEventType().toUpperCase()));
             } catch (IllegalArgumentException e) {
                 event.setEventType(Event.EventType.NORMAL);
             }
        } else {
             event.setEventType(Event.EventType.NORMAL);
        }

        // ✅ LOGIC SPLIT: 
        // If MOVIE -> Date/Time/Price are NULL (Handled in ShowTimes)
        // If NORMAL -> Date/Time/Price are REQUIRED (Old Logic)
        if (event.getEventType() == Event.EventType.MOVIE) {
             event.setDate(null);
             event.setTime(null);
             event.setPrice(0.0); // Base price can be 0, specific showtimes have prices
             event.setSeated(true); // Movies are always seated
             event.setTotalCapacity(0); // Capacity depends on the Hall selected later
        } else {
             // NORMAL EVENT LOGIC (UNCHANGED)
             event.setDate(request.getDate());
             event.setTime(request.getTime());
             event.setPrice(request.getPrice());
             event.setSeated(request.isSeated());
             event.setTotalRows(request.getTotalRows());
             event.setTotalCols(request.getTotalCols());
             
             // Calculate Capacity
             if (request.isSeated()) {
                int capacity = (request.getTotalRows() != null && request.getTotalCols() != null) 
                               ? request.getTotalRows() * request.getTotalCols() 
                               : 0;
                event.setTotalCapacity(capacity); 
                event.setAvailableSeats(capacity);
             } else {
                int seats = (request.getTotalCapacity() != null) ? request.getTotalCapacity() : 100;
                event.setTotalCapacity(seats);    
                event.setAvailableSeats(seats);
             }
        }
        
        event.setOrganizer(organizer);
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public List<Event> getMyEvents(String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return eventRepository.findByOrganizer(organizer);
    }

    @Override
    public void deleteEvent(Long id) {
        Event existingEvent = getEventById(id);
        
        // Security Check
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingEvent.getOrganizer().getEmail().equals(currentEmail)) {
            throw new RuntimeException("You are not authorized to delete this event!");
        }

        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> searchEvents(String keyword) {
        return eventRepository.searchEvents(keyword);
    }

    @Override
    public List<Event> filterByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    @Override
    public Event updateEvent(Long id, EventRequest request) {
        Event existingEvent = getEventById(id); 

        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingEvent.getOrganizer().getEmail().equals(currentEmail)) {
            throw new RuntimeException("You are not authorized to edit this event!");
        }

        existingEvent.setTitle(request.getTitle());
        existingEvent.setDescription(request.getDescription());
        existingEvent.setCategory(request.getCategory());
        
        // Only update Date/Time if it's NOT a movie
        if (existingEvent.getEventType() != Event.EventType.MOVIE) {
            existingEvent.setDate(request.getDate());
            existingEvent.setTime(request.getTime());
            existingEvent.setPrice(request.getPrice());
            existingEvent.setSeated(request.isSeated());
            existingEvent.setTotalRows(request.getTotalRows());
            existingEvent.setTotalCols(request.getTotalCols());
             
            if (request.isSeated()) {
                 int capacity = (request.getTotalRows() != null && request.getTotalCols() != null) 
                                ? request.getTotalRows() * request.getTotalCols() 
                                : existingEvent.getTotalCapacity();
                 existingEvent.setTotalCapacity(capacity);
            } else if(request.getTotalCapacity() != null) {
                 existingEvent.setTotalCapacity(request.getTotalCapacity());
            }
        }

        existingEvent.setLocation(request.getLocation());
        existingEvent.setImageUrl(request.getImageUrl());
        
        return eventRepository.save(existingEvent);
    }

    @Override
    public List<Event> getRecommendedEvents(Long currentEventId) {
        Event currentEvent = getEventById(currentEventId);
        
        List<Event> recommendations = eventRepository.findTop4ByCategoryIgnoreCaseAndIdNot(currentEvent.getCategory(), currentEventId);
        
        if (recommendations.isEmpty()) {
            return eventRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getDate() == null || b.getDate() == null) return 0;
                    return b.getDate().compareTo(a.getDate());
                }) 
                .limit(4)
                .collect(Collectors.toList());
        }
        
        Collections.shuffle(recommendations);
        return recommendations.stream().limit(4).collect(Collectors.toList());
    }
}