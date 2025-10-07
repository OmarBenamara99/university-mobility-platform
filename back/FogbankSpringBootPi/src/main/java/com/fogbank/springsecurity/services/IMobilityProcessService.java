package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.MobilityProcess;

import java.util.Optional;

public interface IMobilityProcessService {
    MobilityProcess createMobilityProcess(Integer candidatureId);
    boolean checkStudentAccess(Long userId);
    Optional<MobilityProcess> getByCandidatureId(Integer candidatureId);


}
