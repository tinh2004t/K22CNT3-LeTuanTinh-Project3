package com.hatechno.dto;

import lombok.Data;

@Data
public class UpdateComplaintStatusDTO {
    private String status; // Pending, Resolved, Rejected
}
