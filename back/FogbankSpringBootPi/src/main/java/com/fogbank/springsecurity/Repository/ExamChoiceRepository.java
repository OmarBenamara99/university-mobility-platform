package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.ExamChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamChoiceRepository extends JpaRepository<ExamChoice, Long> {
    List<ExamChoice> findByStudentId(Long studentId);
    List<ExamChoice> findByOfferId(Integer offerId);
    Optional<ExamChoice> findByStudentIdAndOfferId(Long studentId, Integer offerId);
    boolean existsByStudentIdAndOfferId(Long studentId, Integer offerId);
}
