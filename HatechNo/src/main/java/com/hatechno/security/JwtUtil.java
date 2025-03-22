package com.hatechno.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "01234567890123456789012345678901"; // 32 ký tự để đảm bảo mã hóa HMAC-SHA
    private static final long EXPIRATION_TIME = 86400000; // 1 ngày (milliseconds)

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Tạo token JWT
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Giải mã và lấy thông tin từ token
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Lấy username từ token
    public String getUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Lấy vai trò từ token
    public String getRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // Kiểm tra xem token có hợp lệ không
    public boolean validateToken(String token, String username) {
        return getUsername(token).equals(username) && extractClaims(token).getExpiration().after(new Date());
    }
}
