package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.DocumentType;
import com.fogbank.springsecurity.entities.EquivalenceDocument;
import com.fogbank.springsecurity.entities.ExamChoice;
import com.fogbank.springsecurity.entities.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IEquivalenceService {
    // Exam Choice methods
    ExamChoice submitExamChoice(ExamChoice examChoice, Integer studentId, Integer offerId);
    List<ExamChoice> getStudentExamChoices(Integer studentId);
    List<ExamChoice> getOfferExamChoices(Integer offerId);
    ExamChoice getStudentExamChoiceForOffer(Integer studentId, Integer offerId);
    boolean hasStudentSubmittedChoice(Integer studentId, Integer offerId);

    // Document methods
    List<EquivalenceDocument> getDocumentsByOffer(Integer offerId);
    byte[] downloadDocument(Long documentId);
    void deleteDocument(Long documentId);
    EquivalenceDocument getDocumentById(Long documentId);
    // Add to IEquivalenceService
    List<ExamChoice> getAllExamChoices();


    // Add these methods to your IEquivalenceService
    EquivalenceDocument uploadStudentTranscript(MultipartFile file, Integer studentId, Integer offerId, String originalFileName);
    List<EquivalenceDocument> getStudentTranscripts(Integer studentId);
    List<EquivalenceDocument> getAllStudentTranscripts();
    List<EquivalenceDocument> getStudentTranscriptsByOffer(Integer offerId);

    // Update the uploadDocument method to include type
    // Update the uploadDocument method to include type AND student
    EquivalenceDocument uploadDocument(MultipartFile file, Integer offerId, String originalFileName, DocumentType type, User student);
}
