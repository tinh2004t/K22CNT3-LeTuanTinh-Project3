package com.hatechno.service;

import com.hatechno.model.Notification;
import com.hatechno.model.User;
import com.hatechno.repository.NotificationRepository;
import com.hatechno.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification sendNotification(Long userId, String title, String message) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .createdAt(LocalDateTime.now())
                .recipient(user)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientId(userId);
    }
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll(); // Lấy tất cả thông báo
    }
}
