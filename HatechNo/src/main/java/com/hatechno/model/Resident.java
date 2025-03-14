package com.hatechno.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Residents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int residentId;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, length = 15)
    private String phone;

    @Column(unique = true, length = 100)
    private String email;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;
}
