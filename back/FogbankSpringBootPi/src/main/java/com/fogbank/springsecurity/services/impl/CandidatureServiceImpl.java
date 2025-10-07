package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.CandidatureRepository;
import com.fogbank.springsecurity.Repository.OffreRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.dto.ScoreUpdateDto;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.services.ICandidatureService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class CandidatureServiceImpl implements ICandidatureService {
    CandidatureRepository candidatureRepository;
    private final OffreRepository offreRepository;
    private final UserRepository userRepository;

    @Override
    public List<Candidature> getAllCandidatures() { return candidatureRepository.findAll(); }

    @Override
    public Candidature addCandidature(Candidature candidature) { return candidatureRepository.save(candidature); }

    @Override
    public Candidature updateCandidature(Candidature updatedCandidature) {
        // Get the original from DB
        Candidature existing = candidatureRepository.findById(updatedCandidature.getId())
                .orElseThrow(() -> new RuntimeException("Candidature not found"));

        // Preserve the original user and offer
        updatedCandidature.setUser(existing.getUser());
        updatedCandidature.setOffre(existing.getOffre());

        // Set new date of modification
        updatedCandidature.setDateDepot(LocalDate.now());

        return candidatureRepository.save(updatedCandidature);
    }

    @Override
    public void deleteCandidature(Integer id) {
        if(candidatureRepository.existsById(id)){candidatureRepository.deleteById(id);
            System.out.println("Club with ID " + id + " has been deleted successfully.");}
        else {System.out.println("Club with ID " + id + " does not exist.");}
    }

    @Override
    public Candidature getCandidatureById(Integer id) { return candidatureRepository.findById(id).orElse(null); }

    @Override
    public List<Candidature> getCandidaturesByUserId(Long userId) {
        return candidatureRepository.findByUserId(userId);
    }


    @Override
    @Transactional
    public void addFilesToCandidature(Integer candidatureId,
                                      MultipartFile cvFile,
                                      MultipartFile lettreMotivationFile,
                                      MultipartFile autreDocsFile) throws IOException {

        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature not found"));

        // Handle CV file
        if (cvFile != null && !cvFile.isEmpty()) {
            candidature.setCV(cvFile.getOriginalFilename());
            candidature.setCvData(cvFile.getBytes());
        }

        // Handle Motivation Letter file
        if (lettreMotivationFile != null && !lettreMotivationFile.isEmpty()) {
            candidature.setLettreMotivation(lettreMotivationFile.getOriginalFilename());
            candidature.setLettreMotivationData(lettreMotivationFile.getBytes());
        }

        // Handle Other Documents file
        if (autreDocsFile != null && !autreDocsFile.isEmpty()) {
            candidature.setAutreDocs(autreDocsFile.getOriginalFilename());
            candidature.setAutreDocsData(autreDocsFile.getBytes());
        }

        candidatureRepository.save(candidature);
    }

    @Transactional // THIS IS CRUCIAL
    public void updateScores(List<ScoreUpdateDto> updates) {
        updates.forEach(update -> {
            Candidature c = candidatureRepository.findById(update.id())
                    .orElseThrow(() -> new RuntimeException("Candidature not found"));

            System.out.println("Updating candidature " + update.id()
                    + " with score: " + update.score()
                    + " and status: " + update.statut()); // Debug log

            c.setScore(update.score());
            c.setStatut(update.statut());
        });
    }


    @Override
    @Transactional
    public void deleteAllUserCandidatures(Long userId) {
        // Delete all candidatures for this user
        candidatureRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public void confirmSingleCandidature(Long userId, Integer candidatureIdToKeep) {
        // First verify the candidature belongs to this user
        Candidature toKeep = candidatureRepository.findByIdAndUserId(candidatureIdToKeep, userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidature not found for this user"));

        // Delete all other candidatures
        candidatureRepository.deleteByUserIdAndIdNot(userId, candidatureIdToKeep);
    }

}
