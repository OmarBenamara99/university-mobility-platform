package com.fogbank.springsecurity.Repository;


import com.fogbank.springsecurity.entities.AdministrativeFile;
import com.fogbank.springsecurity.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministrativeFileRepository extends JpaRepository<AdministrativeFile, Integer> {
    // Crucial custom query: Find an AdministrativeFile by its linked Candidature
    Optional<AdministrativeFile> findByCandidature(Candidature candidature);

    // Another useful query: Check if an AdministrativeFile already exists for a Candidature
    boolean existsByCandidature(Candidature candidature);
}
