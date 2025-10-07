package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.AcceptanceProofRepository;
import com.fogbank.springsecurity.entities.AcceptanceProof;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.FileStatus;
import com.fogbank.springsecurity.entities.ProofStatus;
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
@Slf4j
public class AcceptanceProofServiceImpl implements IAcceptanceProofService {
    private final AcceptanceProofRepository acceptanceProofRepository;
    private final ICandidatureService candidatureService;
    private final IAdministrativeFileService administrativeFileService;
    private final IMobilityProcessService mobilityProcessService;

    // Add explicit constructor with @Lazy on the circular dependency
    public AcceptanceProofServiceImpl(AcceptanceProofRepository acceptanceProofRepository,
                                      ICandidatureService candidatureService,
                                      @Lazy IAdministrativeFileService administrativeFileService, // Add @Lazy here
                                      IMobilityProcessService mobilityProcessService) {
        this.acceptanceProofRepository = acceptanceProofRepository;
        this.candidatureService = candidatureService;
        this.administrativeFileService = administrativeFileService;
        this.mobilityProcessService = mobilityProcessService;
    }

    @Override
    public AcceptanceProof createAcceptanceProof(Candidature candidature) {
        // Check if a proof already exists to avoid duplicates
        if (acceptanceProofRepository.existsByCandidature(candidature)) {
            log.warn("Attempted to create an AcceptanceProof for Candidature ID {}, but one already exists.", candidature.getId());
            return acceptanceProofRepository.findByCandidature(candidature).orElse(null);
        }

        // Create and configure the new proof
        AcceptanceProof newProof = AcceptanceProof.builder()
                .candidature(candidature)
                .createdAt(LocalDateTime.now())
                .lastUpdated(LocalDateTime.now())
                .status(ProofStatus.PENDING_UPLOAD) // Initial state
                .build();

        // Save and return the new entity
        return acceptanceProofRepository.save(newProof);
    }

    @Override
    public Optional<AcceptanceProof> getByCandidature(Candidature candidature) {
        return acceptanceProofRepository.findByCandidature(candidature);
    }

    @Override
    public AcceptanceProof uploadAcceptanceDocument(Integer proofId, MultipartFile multipartFile) throws IOException {
        AcceptanceProof existingProof = acceptanceProofRepository.findById(proofId)
                .orElseThrow(() -> new RuntimeException("AcceptanceProof not found with id: " + proofId));

        // Process the file upload
        existingProof.setDocumentFilename(multipartFile.getOriginalFilename());
        existingProof.setAcceptanceDocumentData(multipartFile.getBytes());
        existingProof.setStatus(ProofStatus.UNDER_REVIEW); // Ready for admin check
        existingProof.setLastUpdated(LocalDateTime.now());

        return acceptanceProofRepository.save(existingProof);
    }

    @Override
    public List<AcceptanceProof> getProofsByUserId(Long userId) {
        // 1. Get all candidatures for this user
        List<Candidature> userCandidatures = candidatureService.getCandidaturesByUserId(userId);

        // 2. For each candidature, check if it has an acceptance proof
        // 3. Return the list of all found acceptance proofs
        return userCandidatures.stream()
                .map(acceptanceProofRepository::findByCandidature) // Returns Optional<AcceptanceProof>
                .filter(Optional::isPresent) // Keep only the ones that have a proof
                .map(Optional::get) // Get the AcceptanceProof from the Optional
                .toList();
    }

    @Override
    public AcceptanceProof updateStatus(Integer proofId, ProofStatus newStatus) {
        AcceptanceProof existingProof = acceptanceProofRepository.findById(proofId)
                .orElseThrow(() -> new RuntimeException("AcceptanceProof not found with id: " + proofId));

        log.info("Updating status of AcceptanceProof ID {} from {} to {}",
                proofId, existingProof.getStatus(), newStatus);

        existingProof.setStatus(newStatus);
        existingProof.setLastUpdated(LocalDateTime.now());

        AcceptanceProof updatedProof = acceptanceProofRepository.save(existingProof);

        // NEW: CHECK FOR MOBILITY PROCESS CREATION
        // Get the candidature ID and check if both admin file and acceptance proof are completed
        Integer candidatureId = existingProof.getCandidature().getId();
        checkAndCreateMobilityProcess(candidatureId);
        return updatedProof;

    }

    @Override
    public boolean existsByCandidature(Candidature candidature) {
        return acceptanceProofRepository.existsByCandidature(candidature);
    }

    @Override
    public List<AcceptanceProof> getAllAdminProofs() {
        return acceptanceProofRepository.findAll();
    }

    @Override
    public AcceptanceProof getById(Integer proofId) {
        return acceptanceProofRepository.findById(proofId)
                .orElseThrow(() -> new RuntimeException("AcceptanceProof not found with id: " + proofId));
    }

    @Override
    public Optional<AcceptanceProof> getByCandidatureId(Integer candidatureId) {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        return acceptanceProofRepository.findByCandidature(candidature);
    }

    // Add this method to AcceptanceProofServiceImpl
    private void checkAndCreateMobilityProcess(Integer candidatureId) {
        try {
            // Get the candidature first
            Candidature candidature = candidatureService.getCandidatureById(candidatureId);

            // Check if both are completed
            boolean adminCompleted = administrativeFileService.getByCandidature(candidature)
                    .map(file -> file.getStatus() == FileStatus.COMPLETED)
                    .orElse(false);

            boolean proofApproved = getByCandidature(candidature)
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
}
