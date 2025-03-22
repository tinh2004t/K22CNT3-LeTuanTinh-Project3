package com.hatechno.service;

import com.hatechno.model.Invoice;
import com.hatechno.model.InvoiceStatus;
import com.hatechno.model.Resident;
import com.hatechno.repository.InvoiceRepository;
import com.hatechno.repository.ResidentRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ResidentRepository residentRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Invoice saveInvoice(Invoice invoice) {
        // Kiểm tra Resident có tồn tại không
    	Resident resident = residentRepository.findById(invoice.getResident().getResidentId())
    			.orElseThrow(() -> new RuntimeException("Resident not found"));


        // Gán lại Resident vào Invoice
        invoice.setResident(resident);

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    
    public List<Invoice> getInvoicesByResidentId(int residentId) {
        Optional<Resident> resident = residentRepository.findById(residentId);
        if (resident.isPresent()) {
            return invoiceRepository.findByResident(resident.get());
        }
        throw new RuntimeException("Resident không tồn tại với ID: " + residentId);
    }
    
 // Cập nhật hóa đơn
    @Transactional
    public Invoice updateInvoice(Long invoiceId, Invoice invoiceDetails) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + invoiceId));
        
        // Cập nhật các trường của hóa đơn
        if (invoiceDetails.getStatus() != null) {
            invoice.setStatus(invoiceDetails.getStatus());
        }
        
        // Giữ nguyên các thông tin khác như resident, amount, dueDate nếu không được cập nhật
        if (invoiceDetails.getAmount() != null) {
            invoice.setAmount(invoiceDetails.getAmount());
        }
        
        if (invoiceDetails.getDueDate() != null) {
            invoice.setDueDate(invoiceDetails.getDueDate());
        }
        
        // Lưu và trả về hóa đơn đã cập nhật
        return invoiceRepository.save(invoice);
    }
    
}
