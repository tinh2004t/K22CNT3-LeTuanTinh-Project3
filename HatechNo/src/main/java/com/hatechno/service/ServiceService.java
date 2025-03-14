package com.hatechno.service;

import com.hatechno.model.ServiceEntity;
import com.hatechno.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public ServiceEntity addService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    // ✅ Thêm phương thức cập nhật dịch vụ
    public ServiceEntity updateService(Long id, ServiceEntity newServiceData) {
        Optional<ServiceEntity> optionalService = serviceRepository.findById(id);

        if (optionalService.isPresent()) {
            ServiceEntity existingService = optionalService.get();
            existingService.setServiceName(newServiceData.getServiceName());
            existingService.setDescription(newServiceData.getDescription());
            return serviceRepository.save(existingService);
        } else {
            throw new RuntimeException("Service not found with id " + id);
        }
    }
    
 // ✅ Thêm phương thức xóa dịch vụ
    public void deleteService(Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
        } else {
            throw new RuntimeException("Service not found with id " + id);
        }
    }

}
