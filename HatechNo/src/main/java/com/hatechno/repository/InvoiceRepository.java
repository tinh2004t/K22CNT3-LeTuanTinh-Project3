package com.hatechno.repository;

import com.hatechno.model.Invoice;
import com.hatechno.model.Resident;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
	List<Invoice> findByResident(Resident resident);
}
