package com.hatechno.controller;

import com.hatechno.model.ServiceFeeEntity;
import com.hatechno.service.ServiceFeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-fees")
public class ServiceFeeController {

    @Autowired
    private ServiceFeeService serviceFeeService;

    // Lấy danh sách phí dịch vụ theo căn hộ
    @GetMapping("/apartment/{apartmentId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ServiceFeeEntity>> getFeesByApartment(@PathVariable Long apartmentId) {
        List<ServiceFeeEntity> fees = serviceFeeService.getFeesByApartment(apartmentId);
        return ResponseEntity.ok(fees);
    }
    
    // Lấy tất cả danh sách phí dịch vụ
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ServiceFeeEntity> getAllServiceFees() {
        return serviceFeeService.getAllServiceFees();
    }
    
 // API cập nhật phí dịch vụ
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ServiceFeeEntity> updateServiceFee(
            @PathVariable Long id, @RequestBody ServiceFeeEntity serviceFee) {
    	ServiceFeeEntity updatedServiceFee = serviceFeeService.updateServiceFee(id, serviceFee);
        return ResponseEntity.ok(updatedServiceFee);
    }
    
 // API xóa phí dịch vụ
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteServiceFee(@PathVariable Long id) {
        serviceFeeService.deleteServiceFee(id);
        return ResponseEntity.ok("Service Fee deleted successfully!");
    }


    // Thêm phí dịch vụ
    @PostMapping
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ServiceFeeEntity> addServiceFee(@RequestBody ServiceFeeEntity serviceFee) {
        ServiceFeeEntity savedFee = serviceFeeService.addServiceFee(serviceFee);
        return ResponseEntity.ok(savedFee);
    }
}
