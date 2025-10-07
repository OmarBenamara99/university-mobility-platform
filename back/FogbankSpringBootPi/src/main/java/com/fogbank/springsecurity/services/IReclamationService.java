package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.Reclamation;

import java.util.List;

public interface IReclamationService {
    Reclamation submitReclamation(Reclamation reclamation, Integer studentId);

    List<Reclamation> getStudentReclamations(Integer studentId);

    List<Reclamation> getUnresolvedReclamations();

    List<Reclamation> getResolvedReclamations();

    Reclamation respondToReclamation(Long reclamationId, String response);

    Long getUnresolvedCount();
}
