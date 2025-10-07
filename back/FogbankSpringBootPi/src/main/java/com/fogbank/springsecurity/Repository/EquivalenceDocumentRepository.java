package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.DocumentType;
import com.fogbank.springsecurity.entities.EquivalenceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquivalenceDocumentRepository extends JpaRepository<EquivalenceDocument, Long> {
    List<EquivalenceDocument> findByOfferId(Integer offerId);
    List<EquivalenceDocument> findByStudentId(Long studentId);
    List<EquivalenceDocument> findByOfferIdAndType(Integer offerId, DocumentType type);
    List<EquivalenceDocument> findByStudentIdAndType(Long studentId, DocumentType type);
    Optional<EquivalenceDocument> findByStudentIdAndOfferIdAndType(Long studentId, Integer offerId, DocumentType type);
    // Add to EquivalenceDocumentRepository
    List<EquivalenceDocument> findByType(DocumentType type);
    Optional<EquivalenceDocument> findByOfferIdAndFileName(Integer offerId, String fileName);
}
