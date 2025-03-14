package com.hatechno.controller;

import com.hatechno.model.ServiceEntity;
import com.hatechno.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // Lấy danh sách tất cả dịch vụ
    @GetMapping
    public List<ServiceEntity> getAllServices() {
        List<ServiceEntity> services = serviceService.getAllServices();
        System.out.println("Services found: " + services.size());
        return services;
    }

    
 // API cập nhật thông tin dịch vụ
    @PutMapping("/{id}")
    public ServiceEntity updateService(@PathVariable Long id, @RequestBody ServiceEntity service) {
        return serviceService.updateService(id, service);
    }
    
 // API xóa dịch vụ
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully!");
    }



    // Thêm một dịch vụ mới
    @PostMapping
    public ResponseEntity<ServiceEntity> addService(@RequestBody ServiceEntity service) {
        ServiceEntity savedService = serviceService.addService(service);
        return ResponseEntity.ok(savedService);
    }
}
