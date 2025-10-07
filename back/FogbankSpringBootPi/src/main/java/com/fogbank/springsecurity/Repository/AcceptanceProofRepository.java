package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.AcceptanceProof;
import com.fogbank.springsecurity.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcceptanceProofRepository extends JpaRepository<AcceptanceProof, Integer> {
    // Find an AcceptanceProof by its linked Candidature
    Optional<AcceptanceProof> findByCandidature(Candidature candidature);

    // Check if an AcceptanceProof already exists for a Candidature
    boolean existsByCandidature(Candidature candidature);

    // Find all acceptance proofs by status (useful for admin dashboard)
    // List<AcceptanceProof> findByStatus(ProofStatus status);
}
