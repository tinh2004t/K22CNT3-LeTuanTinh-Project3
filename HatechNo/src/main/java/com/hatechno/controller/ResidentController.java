package com.hatechno.controller;

import com.hatechno.model.Resident;
import com.hatechno.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/residents")
public class ResidentController {
    @Autowired
    private ResidentService residentService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<Resident> getAllResidents() {
        return residentService.getAllResidents();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<Resident> getResidentById(@PathVariable int id) {
        Optional<Resident> resident = residentService.getResidentById(id);
        return resident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<Resident> getResidentByPhone(@PathVariable String phone) {
        Optional<Resident> resident = residentService.getResidentByPhone(phone);
        return resident.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Resident addResident(@RequestBody Resident resident) {
        return residentService.addResident(resident);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Resident> updateResident(@PathVariable int id, @RequestBody Resident residentDetails) {
        return ResponseEntity.ok(residentService.updateResident(id, residentDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteResident(@PathVariable int id) {
        residentService.deleteResident(id);
        return ResponseEntity.noContent().build();
    }
}
