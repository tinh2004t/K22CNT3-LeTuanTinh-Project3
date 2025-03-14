package com.hatechno.service;

import com.hatechno.model.Resident;
import com.hatechno.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResidentService {
    @Autowired
    private ResidentRepository residentRepository;

    public List<Resident> getAllResidents() {
        return residentRepository.findAll();
    }

    public Optional<Resident> getResidentById(int id) {
        return residentRepository.findById(id);
    }

    public Resident addResident(Resident resident) {
        return residentRepository.save(resident);
    }

    public Resident updateResident(int id, Resident residentDetails) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cư dân không tồn tại"));

        resident.setFullName(residentDetails.getFullName());
        resident.setPhone(residentDetails.getPhone());
        resident.setEmail(residentDetails.getEmail());
        resident.setApartment(residentDetails.getApartment());

        return residentRepository.save(resident);
    }

    public void deleteResident(int id) {
        residentRepository.deleteById(id);
    }
}
