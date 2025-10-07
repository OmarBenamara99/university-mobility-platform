package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends JpaRepository<Candidature, Integer> {
    List<Candidature> findByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Candidature c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Candidature c WHERE c.user.id = :userId AND c.id != :idToKeep")
    void deleteByUserIdAndIdNot(@Param("userId") Long userId, @Param("idToKeep") Integer idToKeep);

    Optional<Candidature> findByIdAndUserId(Integer id, Long userId);
}
