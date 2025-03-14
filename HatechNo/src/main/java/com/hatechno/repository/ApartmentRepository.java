package com.hatechno.repository;

import com.hatechno.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Đánh dấu đây là một Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {
}
