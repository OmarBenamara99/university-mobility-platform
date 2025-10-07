package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.AcceptanceProof;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.ProofStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IAcceptanceProofService {

    AcceptanceProof createAcceptanceProof(Candidature candidature);
    Optional<AcceptanceProof> getByCandidature(Candidature candidature);
    AcceptanceProof uploadAcceptanceDocument(Integer proofId, MultipartFile file) throws IOException;
    List<AcceptanceProof> getProofsByUserId(Long userId);
    AcceptanceProof updateStatus(Integer proofId, ProofStatus newStatus);
    boolean existsByCandidature(Candidature candidature);
    List<AcceptanceProof> getAllAdminProofs();
    AcceptanceProof getById(Integer proofId);
    Optional<AcceptanceProof> getByCandidatureId(Integer candidatureId);

}
