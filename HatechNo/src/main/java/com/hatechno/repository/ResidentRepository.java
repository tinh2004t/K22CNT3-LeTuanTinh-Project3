package com.hatechno.repository;

import com.hatechno.model.Resident;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Integer> {
	Optional<Resident> findByPhone(String phone);
}
