package com.hatechno.service;

import com.hatechno.model.Invoice;
import com.hatechno.model.Payment;
import com.hatechno.repository.InvoiceRepository;
import com.hatechno.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thanh toán không tồn tại với ID: " + id));

        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentDate(paymentDetails.getPaymentDate());
        payment.setMethod(paymentDetails.getMethod());

        if (paymentDetails.getInvoice() != null && paymentDetails.getInvoice().getInvoiceId() != null) {
            Invoice invoice = invoiceRepository.findById(paymentDetails.getInvoice().getInvoiceId())
                    .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại với ID: " + paymentDetails.getInvoice().getInvoiceId()));
            payment.setInvoice(invoice);
        }

        return paymentRepository.save(payment);
    }
}
    
