package com.hatechno.service;

import com.hatechno.model.ServiceFeeEntity;
import com.hatechno.repository.ServiceFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceFeeService {
    @Autowired
    private ServiceFeeRepository serviceFeeRepository;

    public List<ServiceFeeEntity> getFeesByApartment(Long apartmentId) {
        return serviceFeeRepository.findByApartment_ApartmentId(apartmentId);
    }
    public List<ServiceFeeEntity> getAllServiceFees() {
        return serviceFeeRepository.findAll();
    }
    public ServiceFeeEntity addServiceFee(ServiceFeeEntity serviceFee) {
        return serviceFeeRepository.save(serviceFee);
    }
    
    public ServiceFeeEntity updateServiceFee(Long id, ServiceFeeEntity newServiceFeeData) {
        Optional<ServiceFeeEntity> optionalServiceFee = serviceFeeRepository.findById(id);

        if (optionalServiceFee.isPresent()) {
            ServiceFeeEntity existingServiceFee = optionalServiceFee.get();
            existingServiceFee.setAmount(newServiceFeeData.getAmount());
            existingServiceFee.setStartDate(newServiceFeeData.getStartDate());
            existingServiceFee.setEndDate(newServiceFeeData.getEndDate());
            existingServiceFee.setService(newServiceFeeData.getService());
            return serviceFeeRepository.save(existingServiceFee);
        } else {
            throw new RuntimeException("Service Fee not found with id " + id);
        }
    }
    public void deleteServiceFee(Long id) {
        if (serviceFeeRepository.existsById(id)) {
            serviceFeeRepository.deleteById(id);
        } else {
            throw new RuntimeException("Service Fee not found with id " + id);
        }
    }


}
