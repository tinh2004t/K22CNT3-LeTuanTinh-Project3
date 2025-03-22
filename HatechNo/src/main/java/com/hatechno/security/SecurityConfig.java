package com.hatechno.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                
                //apartments
                .requestMatchers(HttpMethod.GET, "/api/apartments/**").hasAnyAuthority("USER", "ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/apartments/**").hasAuthority("ADMIN") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/apartments/**").hasAuthority("ADMIN") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/apartments/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //residents
                .requestMatchers(HttpMethod.GET, "/api/residents/**").hasAnyAuthority("USER", "ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/residents/**").hasAuthority("ADMIN") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/residents/**").hasAuthority("ADMIN") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/residents/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //service
                .requestMatchers(HttpMethod.GET, "/api/services/**").hasAnyAuthority("USER", "ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/services/**").hasAuthority("ADMIN") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/services/**").hasAuthority("ADMIN") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/services/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                
                //service-fees
                .requestMatchers(HttpMethod.GET, "/api/service-fees/**").hasAuthority("ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/service-fees/**").hasAnyAuthority("ADMIN","USER") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/service-fees/**").hasAuthority("ADMIN") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/service-fees/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //invoices
                .requestMatchers(HttpMethod.GET, "/api/service-fees/**").hasAnyAuthority("ADMIN","USER") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/service-fees/**").hasAnyAuthority("ADMIN","USER") // Chỉ ADMIN thêm
                
                .requestMatchers(HttpMethod.DELETE, "/api/service-fees/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //payments
                .requestMatchers(HttpMethod.GET, "/api/payments/**").hasAuthority("ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/payments/**").hasAnyAuthority("ADMIN","USER") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/payments/**").hasAnyAuthority("ADMIN","USER") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/payments/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //notifications
                .requestMatchers(HttpMethod.GET, "/api/notifications/**").hasAnyAuthority("USER", "ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/notifications/**").hasAuthority("ADMIN") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/notifications/**").hasAuthority("ADMIN") // Chỉ ADMIN sửa
                .requestMatchers(HttpMethod.DELETE, "/api/notifications/**").hasAuthority("ADMIN") // Chỉ ADMIN xóa
                
                //complaint
                .requestMatchers(HttpMethod.GET, "/api/complaints/**").hasAnyAuthority("USER", "ADMIN") // USER & ADMIN có thể xem danh sách
                .requestMatchers(HttpMethod.POST, "/api/complaints/**").hasAuthority("USER") // Chỉ ADMIN thêm
                .requestMatchers(HttpMethod.PUT, "/api/complaints/**").hasAnyAuthority("USER","ADMIN") // Chỉ ADMIN sửa
                 
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
