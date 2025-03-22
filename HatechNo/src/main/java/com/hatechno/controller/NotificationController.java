package com.hatechno.controller;

import com.hatechno.model.Notification;
import com.hatechno.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Notification> sendNotification(@RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String title = request.get("title");
        String message = request.get("message");
        Notification notification = notificationService.sendNotification(userId, title, message);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    // API lấy tất cả thông báo (chỉ ADMIN)
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public ResponseEntity<?> getAllNotifications(Authentication authentication) {
        // In ra danh sách role để kiểm tra
        

        // Kiểm tra nếu không phải ADMIN -> từ chối truy cập
        

        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

}
