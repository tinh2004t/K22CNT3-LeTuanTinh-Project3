package com.hatechno.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Apartments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int apartmentId;

    @Column(nullable = false, unique = true)
    private String apartmentNumber;

    private int floor;
    private float area;
    
    @Column(nullable = false)
    private String status;
}
