package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.OrdreMission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface IOrdreMissionService {
    OrdreMission uploadOrdreMission(Integer offerId, MultipartFile file) throws IOException; // Change Long to Integer
    Optional<OrdreMission> getOrdreMissionByOfferId(Integer offerId); // Change Long to Integer
    ResponseEntity<byte[]> downloadOrdreMission(Integer offerId); // Change Long to Integer
    boolean existsByOfferId(Integer offerId); // Change Long to Integer
}
