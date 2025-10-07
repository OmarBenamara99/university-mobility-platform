package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.EquivalenceDocumentRepository;
import com.fogbank.springsecurity.Repository.ExamChoiceRepository;
import com.fogbank.springsecurity.Repository.OffreRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.*;
import com.fogbank.springsecurity.services.IEquivalenceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EquivalenceServiceImpl implements IEquivalenceService {

    private final ExamChoiceRepository examChoiceRepository;
    private final EquivalenceDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final OffreRepository offreRepository;

    private final Path rootLocation = Paths.get("uploads/equivalence-documents");

    @Override
    @Transactional
    public ExamChoice submitExamChoice(ExamChoice examChoice, Integer studentId, Integer offerId) {
        if (examChoiceRepository.existsByStudentIdAndOfferId(studentId.longValue(), offerId)) {
            throw new RuntimeException("Student already submitted choice for this offer");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Offre offer = offreRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        examChoice.setStudent(student);
        examChoice.setOffer(offer);

        return examChoiceRepository.save(examChoice);
    }

    @Override
    public List<ExamChoice> getStudentExamChoices(Integer studentId) {
        return examChoiceRepository.findByStudentId(studentId.longValue());
    }

    @Override
    public List<ExamChoice> getOfferExamChoices(Integer offerId) {
        return examChoiceRepository.findByOfferId(offerId);
    }

    @Override
    public ExamChoice getStudentExamChoiceForOffer(Integer studentId, Integer offerId) {
        return examChoiceRepository.findByStudentIdAndOfferId(studentId.longValue(), offerId)
                .orElse(null);
    }

    @Override
    public boolean hasStudentSubmittedChoice(Integer studentId, Integer offerId) {
        return examChoiceRepository.existsByStudentIdAndOfferId(studentId.longValue(), offerId);
    }

    @Override
    @Transactional
    public EquivalenceDocument uploadDocument(MultipartFile file, Integer offerId, String originalFileName, DocumentType type, User student) {
        try {
            Offre offer = offreRepository.findById(offerId)
                    .orElseThrow(() -> new RuntimeException("Offer not found"));

            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destinationFile = rootLocation.resolve(fileName);

            Files.copy(file.getInputStream(), destinationFile);

            EquivalenceDocument document = EquivalenceDocument.builder()
                    .fileName(fileName)
                    .filePath(destinationFile.toString())
                    .originalFileName(originalFileName)
                    .type(type)
                    .offer(offer)
                    .student(student)
                    .build();

            return documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }


    @Override
    public List<EquivalenceDocument> getDocumentsByOffer(Integer offerId) {
        return documentRepository.findByOfferId(offerId);
    }

    @Override
    public byte[] downloadDocument(Long documentId) {
        EquivalenceDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        try {
            return Files.readAllBytes(Paths.get(document.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to download document: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteDocument(Long documentId) {
        EquivalenceDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        try {
            Files.deleteIfExists(Paths.get(document.getFilePath()));
            documentRepository.delete(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete document: " + e.getMessage());
        }
    }

    @Override
    public EquivalenceDocument getDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    // Add to EquivalenceServiceImpl
    @Override
    public List<ExamChoice> getAllExamChoices() {
        return examChoiceRepository.findAll();
    }


    @Override
    @Transactional
    public EquivalenceDocument uploadStudentTranscript(MultipartFile file, Integer studentId, Integer offerId, String originalFileName) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Offre offer = offreRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        // Check if student already uploaded a transcript for this offer
        Optional<EquivalenceDocument> existingTranscript = documentRepository
                .findByStudentIdAndOfferIdAndType(studentId.longValue(), offerId, DocumentType.STUDENT_GRADE_TRANSCRIPT);

        if (existingTranscript.isPresent()) {
            throw new RuntimeException("Student already uploaded transcript for this offer");
        }

        return uploadDocument(file, offerId, originalFileName, DocumentType.STUDENT_GRADE_TRANSCRIPT, student);
    }

    @Override
    public List<EquivalenceDocument> getStudentTranscripts(Integer studentId) {
        return documentRepository.findByStudentIdAndType(studentId.longValue(), DocumentType.STUDENT_GRADE_TRANSCRIPT);
    }

    @Override
    public List<EquivalenceDocument> getAllStudentTranscripts() {
        return documentRepository.findByType(DocumentType.STUDENT_GRADE_TRANSCRIPT);
    }

    @Override
    public List<EquivalenceDocument> getStudentTranscriptsByOffer(Integer offerId) {
        return documentRepository.findByOfferIdAndType(offerId, DocumentType.STUDENT_GRADE_TRANSCRIPT);
    }
}
