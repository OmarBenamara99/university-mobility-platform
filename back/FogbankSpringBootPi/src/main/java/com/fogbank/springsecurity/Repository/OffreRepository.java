package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OffreRepository extends JpaRepository<Offre, Integer> {

    @Query("SELECT o FROM Offre o LEFT JOIN FETCH o.candidatures")
    List<Offre> findAllWithCandidatures();

    @Query("SELECT DISTINCT o FROM Offre o JOIN FETCH o.candidatures c WHERE c.user.id = :userId")
    List<Offre> findOffresWithCandidaturesByUserId(@Param("userId") Long userId);


}
