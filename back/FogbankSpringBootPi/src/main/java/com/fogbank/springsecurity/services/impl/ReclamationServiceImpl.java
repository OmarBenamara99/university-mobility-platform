package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.ReclamationRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.Reclamation;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.IReclamationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReclamationServiceImpl implements IReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final UserRepository userRepository;
    @Override
    @Transactional
    public Reclamation submitReclamation(Reclamation reclamation, Integer studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        reclamation.setStudent(student);
        return reclamationRepository.save(reclamation);
    }

    @Override
    public List<Reclamation> getStudentReclamations(Integer studentId) {
        return reclamationRepository.findByStudentId(studentId.longValue());
    }

    @Override
    public List<Reclamation> getUnresolvedReclamations() {
        return reclamationRepository.findByResolvedFalse();
    }

    @Override
    public List<Reclamation> getResolvedReclamations() {
        return reclamationRepository.findByResolvedTrue();
    }

    @Override
    @Transactional
    public Reclamation respondToReclamation(Long reclamationId, String response) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found"));

        reclamation.setAdminResponse(response);
        return reclamationRepository.save(reclamation);
    }

    @Override
    public Long getUnresolvedCount() {
        return reclamationRepository.countByResolvedFalse();
    }
}
