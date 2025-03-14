package com.hatechno.repository;

import com.hatechno.model.ServiceFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceFeeRepository extends JpaRepository<ServiceFeeEntity, Long> {
    List<ServiceFeeEntity> findByApartment_ApartmentId(Long apartmentId);
}
