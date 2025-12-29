package com.eventmate.eventmate_backend.service;

import com.eventmate.eventmate_backend.dto.EventRequest;
import com.eventmate.eventmate_backend.model.Event;
import java.util.List;

public interface EventService {
    // Existing methods
    Event createEvent(EventRequest request, String userEmail);
    List<Event> getAllEvents();
    Event getEventById(Long id);
    void deleteEvent(Long id);
    List<Event> searchEvents(String keyword);
    List<Event> filterByCategory(String category);
    Event updateEvent(Long id, EventRequest request);
    List<Event> getMyEvents(String email);

    // NEW: Recommendation Method Signature
    List<Event> getRecommendedEvents(Long currentEventId);
}