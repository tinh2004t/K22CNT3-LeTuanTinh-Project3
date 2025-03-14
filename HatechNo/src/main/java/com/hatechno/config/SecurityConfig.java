package com.hatechno.config;

import com.hatechno.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers("/auth/**").permitAll()
            		.requestMatchers("/services/**").permitAll()
            		.requestMatchers("/service-fees/**").permitAll()
            		.requestMatchers("/residents/**").permitAll()
            		.requestMatchers("/payments/**").permitAll()
            		.requestMatchers("/invoices/**").permitAll()
            		.requestMatchers("/apartments/**").permitAll()

            		// Chỉ cho phép ADMIN truy cập danh sách tất cả thông báo
            		.requestMatchers("/notifications/all").hasRole("ADMIN")

            		// Người dùng đã đăng nhập có thể xem thông báo của họ
            		.requestMatchers("/notifications/user/**").authenticated()

            		// Các API admin yêu cầu quyền ADMIN
            		.requestMatchers("/api/admin/**").hasRole("ADMIN")

            		// API khiếu nại cho cả USER & ADMIN
            		.requestMatchers("/api/complaints/**").hasAnyRole("USER", "ADMIN")

            		// Tất cả các request khác cần xác thực
            		.anyRequest().authenticated()

            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
