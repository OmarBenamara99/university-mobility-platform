package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.MobilityProcess;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MobilityProcessRepository extends JpaRepository<MobilityProcess, Integer> {

    Optional<MobilityProcess> findByCandidature(Candidature candidature);

    Optional<MobilityProcess> findByCandidatureId(Integer candidatureId);

    boolean existsByCandidature(Candidature candidature);
    boolean existsByCandidatureId(Integer candidatureId);


}
