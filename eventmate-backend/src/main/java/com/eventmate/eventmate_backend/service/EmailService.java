package com.eventmate.eventmate_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String userName, String eventTitle, String bookingId, int tickets, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Booking Confirmed: " + eventTitle);
        message.setText("Hello " + userName + ",\n\n" +
                "Your booking for '" + eventTitle + "' is confirmed!\n\n" +
                "Booking ID: " + bookingId + "\n" +
                "Tickets: " + tickets + "\n" +
                "Total Amount: ₹" + amount + "\n\n" +
                "Please show your QR Code at the venue entry.\n" +
                "View your ticket here: http://localhost:5173/dashboard\n\n" +
                "Thank you,\nTeam EventMate");

        mailSender.send(message);
        System.out.println("✅ Email sent to " + toEmail);
    }
}