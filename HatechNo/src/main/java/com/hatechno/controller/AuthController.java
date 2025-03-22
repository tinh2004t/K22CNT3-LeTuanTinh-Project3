package com.hatechno.controller;

import com.hatechno.model.Role;
import com.hatechno.model.User;
import com.hatechno.repository.UserRepository;
import com.hatechno.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) { // 🆕 Nếu chưa có role, gán mặc định
            user.setRole(Role.USER);
        }

        userRepository.save(user);
        return "User registered successfully!";
    }


    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String role = existingUser.getRole().name(); // 🆕 Lấy role của user
        String token = jwtUtil.generateToken(existingUser.getUsername(), role);
        String userId = String.valueOf(existingUser.getId()); // 🆕 Lấy userId

        return Map.of(
            "token", token,
            "role", role,
            "userId", userId// 🆕 Trả về role
        );
    }

}
