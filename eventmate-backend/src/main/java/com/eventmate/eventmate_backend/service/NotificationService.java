package com.eventmate.eventmate_backend.service;

import com.eventmate.eventmate_backend.model.Notification;
import com.eventmate.eventmate_backend.model.User;
import com.eventmate.eventmate_backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    
    // Injecting MailSender (It might be null if config is wrong, so we use try-catch)
    @Autowired(required = false) 
    private JavaMailSender mailSender;

    // 1. Create In-App Notification
    public void createNotification(User user, String title, String message) {
        Notification note = new Notification();
        note.setUser(user);
        note.setTitle(title);
        note.setMessage(message);
        notificationRepository.save(note);
        
        // Trigger Email automatically
        sendEmail(user.getEmail(), title, message);
    }

    // 2. Send Real Email
    public void sendEmail(String to, String subject, String body) {
        try {
            if(mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("✅ Email sent to " + to);
            } else {
                System.out.println("⚠️ Email Config missing. Simulation: Email to " + to + " | " + subject);
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }

    // 3. Get User Notifications
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedOnDesc(user.getId());
    }
}