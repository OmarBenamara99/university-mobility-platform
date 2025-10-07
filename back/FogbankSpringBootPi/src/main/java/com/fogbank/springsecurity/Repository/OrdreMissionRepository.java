package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.OrdreMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrdreMissionRepository extends JpaRepository<OrdreMission, Long> {
    Optional<OrdreMission> findByOfferId(Integer offerId); // Change Long to Integer
    boolean existsByOfferId(Integer offerId); // Change Long to Integer
}
