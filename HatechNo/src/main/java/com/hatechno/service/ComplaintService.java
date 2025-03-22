package com.hatechno.service;

import com.hatechno.model.Complaint;
import com.hatechno.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        Optional<Complaint> complaintOptional = complaintRepository.findById(id);
        if (complaintOptional.isPresent()) {
            Complaint complaint = complaintOptional.get();
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }
        throw new RuntimeException("Complaint not found!");
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

}
