package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.dto.CandidatureFileUploadDTO;
import com.fogbank.springsecurity.dto.ScoreUpdateDto;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.Offre;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICandidatureService {
    List<Candidature> getAllCandidatures();
    Candidature addCandidature(Candidature candidature);
    Candidature updateCandidature(Candidature candidature);
    public void deleteCandidature(Integer id);
    Candidature getCandidatureById(Integer id);
    List<Candidature> getCandidaturesByUserId(Long userId);
    // Add this new method
    void addFilesToCandidature(Integer candidatureId,
                               MultipartFile cvFile,
                               MultipartFile lettreMotivationFile,
                               MultipartFile autreDocsFile) throws IOException;

    @Transactional
    void updateScores(List<ScoreUpdateDto> updates);

    @Transactional
    void deleteAllUserCandidatures(Long userId);

    @Transactional
    void confirmSingleCandidature(Long userId, Integer candidatureIdToKeep);
}
