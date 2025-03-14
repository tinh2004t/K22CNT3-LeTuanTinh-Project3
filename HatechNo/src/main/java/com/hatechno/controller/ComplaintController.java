package com.hatechno.controller;

import com.hatechno.dto.ComplaintDTO;
import com.hatechno.dto.UpdateComplaintStatusDTO;
import com.hatechno.model.Complaint;
import com.hatechno.model.User;
import com.hatechno.service.ComplaintService;
import com.hatechno.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;
    private final UserService userService;
    
    public ComplaintController(ComplaintService complaintService, UserService userService) {
        this.complaintService = complaintService;
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping("/create")
    public ResponseEntity<Complaint> createComplaint(@AuthenticationPrincipal UserDetails userDetails,
                                                     @RequestBody ComplaintDTO complaintDTO) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        Complaint complaint = new Complaint();
        complaint.setTitle(complaintDTO.getTitle());
        complaint.setDescription(complaintDTO.getDescription());
        complaint.setUser(user);
        Complaint savedComplaint = complaintService.createComplaint(complaint);
        return ResponseEntity.ok(savedComplaint);
    }


    @GetMapping
    public ResponseEntity<List<Complaint>> getUserComplaints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        List<Complaint> complaints = complaintService.getComplaintsByUser(user.getId());
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id,
                                                           @RequestBody UpdateComplaintStatusDTO statusDTO) {
        Complaint updatedComplaint = complaintService.updateComplaintStatus(id, statusDTO.getStatus());
        return ResponseEntity.ok(updatedComplaint);
    }
}
