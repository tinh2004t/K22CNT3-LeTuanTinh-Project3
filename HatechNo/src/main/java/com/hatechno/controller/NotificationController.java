package com.hatechno.controller;

import com.hatechno.model.Notification;
import com.hatechno.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<Notification> sendNotification(@RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String title = request.get("title");
        String message = request.get("message");
        Notification notification = notificationService.sendNotification(userId, title, message);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    // API lấy tất cả thông báo (chỉ ADMIN)
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications(Authentication authentication) {
        // In ra danh sách role để kiểm tra
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        System.out.println("User roles: " + roles); // Debug

        // Kiểm tra nếu không phải ADMIN -> từ chối truy cập
        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body("Bạn không có quyền truy cập.");
        }

        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

}
