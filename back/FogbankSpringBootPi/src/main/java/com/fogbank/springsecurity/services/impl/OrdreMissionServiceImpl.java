package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.OffreRepository;
import com.fogbank.springsecurity.Repository.OrdreMissionRepository;
import com.fogbank.springsecurity.entities.Offre;
import com.fogbank.springsecurity.entities.OrdreMission;
import com.fogbank.springsecurity.services.IOrdreMissionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdreMissionServiceImpl implements IOrdreMissionService {
    private final OrdreMissionRepository ordreMissionRepository;
    private final OffreRepository offreRepository;

    @Override
    @Transactional
    public OrdreMission uploadOrdreMission(Integer offerId, MultipartFile file) throws IOException { // Change Long to Integer
        Offre offer = offreRepository.findById(offerId) // This should now work
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + offerId));

        // Delete existing ordre mission if it exists
        ordreMissionRepository.findByOfferId(offerId).ifPresent(ordreMissionRepository::delete);

        OrdreMission ordreMission = OrdreMission.builder()
                .fileName(UUID.randomUUID().toString())
                .originalFileName(file.getOriginalFilename())
                .fileData(file.getBytes())
                .offer(offer)
                .build();

        return ordreMissionRepository.save(ordreMission);
    }

    @Override
    public Optional<OrdreMission> getOrdreMissionByOfferId(Integer offerId) { // Change Long to Integer
        return ordreMissionRepository.findByOfferId(offerId);
    }

    @Override
    public ResponseEntity<byte[]> downloadOrdreMission(Integer offerId) { // Change Long to Integer
        OrdreMission ordreMission = ordreMissionRepository.findByOfferId(offerId)
                .orElseThrow(() -> new RuntimeException("Ordre de Mission not found for offer: " + offerId));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ordreMission.getOriginalFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(ordreMission.getFileData());
    }

    @Override
    public boolean existsByOfferId(Integer offerId) { // Change Long to Integer
        return ordreMissionRepository.existsByOfferId(offerId);
    }
}
