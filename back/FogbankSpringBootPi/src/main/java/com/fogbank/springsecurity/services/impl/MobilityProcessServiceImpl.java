package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.MobilityProcessRepository;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.MobilityProcess;
import com.fogbank.springsecurity.services.ICandidatureService;
import com.fogbank.springsecurity.services.IMobilityProcessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MobilityProcessServiceImpl implements IMobilityProcessService {
    private final MobilityProcessRepository mobilityProcessRepository;
    private final ICandidatureService candidatureService;

    @Override
    public MobilityProcess createMobilityProcess(Integer candidatureId) {
        // Check if already exists
        if (mobilityProcessRepository.existsByCandidatureId(candidatureId)) {
            log.warn("MobilityProcess already exists for Candidature ID: {}", candidatureId);
            return mobilityProcessRepository.findByCandidatureId(candidatureId).orElse(null);
        }

        Candidature candidature = candidatureService.getCandidatureById(candidatureId);

        MobilityProcess newProcess = MobilityProcess.builder()
                .candidature(candidature)
                .createdAt(LocalDateTime.now())
                .lastUpdated(LocalDateTime.now())
                .hasAccessToPreparation(true)
                .build();

        return mobilityProcessRepository.save(newProcess);
    }

    @Override
    public boolean checkStudentAccess(Long userId) {
        // Get student's candidatures and check if any has a mobility process
        return candidatureService.getCandidaturesByUserId(userId).stream()
                .anyMatch(candidature ->
                        mobilityProcessRepository.findByCandidature(candidature).isPresent()
                );
    }

    @Override
    public Optional<MobilityProcess> getByCandidatureId(Integer candidatureId) {
        return mobilityProcessRepository.findByCandidatureId(candidatureId);

    }



}
