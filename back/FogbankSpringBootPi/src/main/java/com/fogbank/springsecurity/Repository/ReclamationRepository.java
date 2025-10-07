package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    // Find reclamations by student
    List<Reclamation> findByStudentId(Long studentId);

    // Find unresolved reclamations (for admin)
    List<Reclamation> findByResolvedFalse();

    // Find resolved reclamations (for admin)
    List<Reclamation> findByResolvedTrue();

    // Count unresolved reclamations
    Long countByResolvedFalse();
}
