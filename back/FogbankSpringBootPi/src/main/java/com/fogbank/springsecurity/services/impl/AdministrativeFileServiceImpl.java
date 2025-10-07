package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.AdministrativeFileRepository;
import com.fogbank.springsecurity.entities.*;
import com.fogbank.springsecurity.services.IAcceptanceProofService;
import com.fogbank.springsecurity.services.IAdministrativeFileService;
import com.fogbank.springsecurity.services.ICandidatureService;
import com.fogbank.springsecurity.services.IMobilityProcessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j // For logging
public class AdministrativeFileServiceImpl implements IAdministrativeFileService {
    private final AdministrativeFileRepository administrativeFileRepository;
    private final ICandidatureService candidatureService;
    private final IAcceptanceProofService acceptanceProofService;
    private final IMobilityProcessService mobilityProcessService;

    // Add explicit constructor with @Lazy on the circular dependency
    public AdministrativeFileServiceImpl(AdministrativeFileRepository administrativeFileRepository,
                                         ICandidatureService candidatureService,
                                         @Lazy IAcceptanceProofService acceptanceProofService, // Add @Lazy here
                                         IMobilityProcessService mobilityProcessService) {
        this.administrativeFileRepository = administrativeFileRepository;
        this.candidatureService = candidatureService;
        this.acceptanceProofService = acceptanceProofService;
        this.mobilityProcessService = mobilityProcessService;
    }


    @Override
    public AdministrativeFile createAdministrativeFile(Candidature candidature) {
        if (administrativeFileRepository.existsByCandidature(candidature)) {
            log.warn("Attempted to create an AdministrativeFile for Candidature ID {}, but one already exists.", candidature.getId());
            return administrativeFileRepository.findByCandidature(candidature).orElse(null);
        }

        AdministrativeFile newFile = AdministrativeFile.builder()
                .candidature(candidature)
                .createdAt(LocalDateTime.now())
                .lastUpdated(LocalDateTime.now())
                .status(FileStatus.PENDING_PAYMENT_CHOICE) // Use FileStatus directly
                .build();

        return administrativeFileRepository.save(newFile);
    }

    @Override
    public Optional<AdministrativeFile> getByCandidature(Candidature candidature) {
        return administrativeFileRepository.findByCandidature(candidature);
    }

    @Override
    public AdministrativeFile updatePaymentMethod(Integer fileId, PaymentMethod paymentMethod) { // Use PaymentMethod directly
        AdministrativeFile existingFile = administrativeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("AdministrativeFile not found with id: " + fileId));

        existingFile.setPaymentMethod(paymentMethod);
        existingFile.setStatus(FileStatus.PENDING_UPLOAD); // Use FileStatus directly
        existingFile.setLastUpdated(LocalDateTime.now());

        return administrativeFileRepository.save(existingFile);
    }

    @Override
    public AdministrativeFile uploadPaymentReceipt(Integer fileId, MultipartFile multipartFile) throws IOException {
        AdministrativeFile existingFile = administrativeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("AdministrativeFile not found with id: " + fileId));

        // Use PaymentMethod directly in the comparison
        if (existingFile.getPaymentMethod() != PaymentMethod.IMMEDIATE_FULL_PAYMENT) {
            throw new RuntimeException("Cannot upload a receipt for a file not set to IMMEDIATE_FULL_PAYMENT");
        }

        existingFile.setPaymentReceiptFilename(multipartFile.getOriginalFilename());
        existingFile.setPaymentReceiptData(multipartFile.getBytes());
        existingFile.setStatus(FileStatus.UNDER_REVIEW); // Use FileStatus directly
        existingFile.setLastUpdated(LocalDateTime.now());

        return administrativeFileRepository.save(existingFile);
    }

    @Override
    public AdministrativeFile uploadCheques(Integer fileId, MultipartFile multipartFile) throws IOException {
        AdministrativeFile existingFile = administrativeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("AdministrativeFile not found with id: " + fileId));

        // Use PaymentMethod directly in the comparison
        if (existingFile.getPaymentMethod() != PaymentMethod.PAYMENT_BY_CHEQUES) {
            throw new RuntimeException("Cannot upload cheques for a file not set to PAYMENT_BY_CHEQUES");
        }

        existingFile.setChequesFilename(multipartFile.getOriginalFilename());
        existingFile.setChequesData(multipartFile.getBytes());
        existingFile.setStatus(FileStatus.UNDER_REVIEW); // Use FileStatus directly
        existingFile.setLastUpdated(LocalDateTime.now());

        return administrativeFileRepository.save(existingFile);
    }

    @Override
    public boolean existsByCandidature(Candidature candidature) {
        return administrativeFileRepository.existsByCandidature(candidature);
    }


    @Override
    public List<AdministrativeFile> getAdminFilesByUserId(Long userId) {
        // This implementation assumes you have access to candidatureService
        // 1. Get all candidatures for this user
        List<Candidature> userCandidatures = candidatureService.getCandidaturesByUserId(userId);

        // 2. For each candidature, check if it has an administrative file
        // 3. Return the list of all found administrative files
        return userCandidatures.stream()
                .map(administrativeFileRepository::findByCandidature) // Returns Optional<AdministrativeFile>
                .filter(Optional::isPresent) // Keep only the ones that have a file
                .map(Optional::get) // Get the AdministrativeFile from the Optional
                .toList();
    }

    @Override
    public AdministrativeFile updateStatus(Integer fileId, FileStatus newStatus) {
        AdministrativeFile existingFile = administrativeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("AdministrativeFile not found with id: " + fileId));

        log.info("Updating status of AdministrativeFile ID {} from {} to {}",
                fileId, existingFile.getStatus(), newStatus);

        existingFile.setStatus(newStatus);
        existingFile.setLastUpdated(LocalDateTime.now());
        AdministrativeFile updatedFile = administrativeFileRepository.save(existingFile);

        // AUTOMATICALLY CREATE ACCEPTANCE PROOF WHEN PAYMENT IS COMPLETED
        if (newStatus == FileStatus.COMPLETED) {
            createAcceptanceProofAutomatically(updatedFile);
        }
        // NEW: CHECK FOR MOBILITY PROCESS CREATION
        // Get the candidature ID and check if both admin file and acceptance proof are completed
        Integer candidatureId = existingFile.getCandidature().getId();
        checkAndCreateMobilityProcess(candidatureId);

        return updatedFile;
    }

    private void createAcceptanceProofAutomatically(AdministrativeFile administrativeFile) {
        try {
            // Check if acceptance proof already exists to avoid duplicates
            if (!acceptanceProofService.existsByCandidature(administrativeFile.getCandidature())) {
                AcceptanceProof newProof = acceptanceProofService.createAcceptanceProof(
                        administrativeFile.getCandidature()
                );
                log.info("Automatically created AcceptanceProof ID {} for Candidature ID {}",
                        newProof.getId(), administrativeFile.getCandidature().getId());
            }
        } catch (Exception e) {
            log.error("Failed to automatically create AcceptanceProof for Candidature ID {}: {}",
                    administrativeFile.getCandidature().getId(), e.getMessage());
        }
    }

    @Override
    public List<AdministrativeFile> getAllAdminFiles() {
        return administrativeFileRepository.findAll(); // This gives you all files
    }

    @Override
    public AdministrativeFile getById(Integer fileId) {
        return administrativeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("AdministrativeFile not found with id: " + fileId));
    }

    private void checkAndCreateMobilityProcess(Integer candidatureId) {
        try {
            // Check if both are completed - USE getByCandidatureId INSTEAD
            boolean adminCompleted = getByCandidatureId(candidatureId)
                    .map(file -> file.getStatus() == FileStatus.COMPLETED)
                    .orElse(false);

            boolean proofApproved = acceptanceProofService.getByCandidatureId(candidatureId)
                    .map(proof -> proof.getStatus() == ProofStatus.APPROVED)
                    .orElse(false);

            if (adminCompleted && proofApproved) {
                mobilityProcessService.createMobilityProcess(candidatureId);
                log.info("Automatically created MobilityProcess for Candidature ID: {}", candidatureId);
            }
        } catch (Exception e) {
            log.error("Error creating MobilityProcess for Candidature ID {}: {}", candidatureId, e.getMessage());
        }
    }

    @Override
    public Optional<AdministrativeFile> getByCandidatureId(Integer candidatureId) {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        return administrativeFileRepository.findByCandidature(candidature);
    }
}
