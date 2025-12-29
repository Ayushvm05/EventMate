package com.eventmate.eventmate_backend.service;

public interface AiService {
    // 1. For Admin: Generate Event Description
    String generateDescription(String title, String category, String keywords);
    
    // 2. For Reviews: Analyze Sentiment
    String analyzeSentiment(String reviewText);
    
    // 3. For Chatbot: Answer User Questions
    String chat(String eventContext, String userQuestion);
}