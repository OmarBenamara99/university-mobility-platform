package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.ExtensionRequest;
import com.fogbank.springsecurity.entities.ExtensionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtensionRequestRepository extends JpaRepository<ExtensionRequest, Long> {
    List<ExtensionRequest> findByStudentId(Long studentId);
    List<ExtensionRequest> findByStatus(ExtensionStatus status);
    List<ExtensionRequest> findAllByOrderBySubmissionDateDesc();
    Long countByStatus(ExtensionStatus status);
}
