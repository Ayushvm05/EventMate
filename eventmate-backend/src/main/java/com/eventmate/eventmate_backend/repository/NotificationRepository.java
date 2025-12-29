package com.eventmate.eventmate_backend.repository;

import com.eventmate.eventmate_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedOnDesc(Long userId);
}