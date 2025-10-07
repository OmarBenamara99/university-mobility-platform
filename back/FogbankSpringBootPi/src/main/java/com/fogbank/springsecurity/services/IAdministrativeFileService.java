package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.AdministrativeFile;
import com.fogbank.springsecurity.entities.Candidature;
import com.fogbank.springsecurity.entities.FileStatus;
import com.fogbank.springsecurity.entities.PaymentMethod;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IAdministrativeFileService {
    AdministrativeFile createAdministrativeFile(Candidature candidature);
    Optional<AdministrativeFile> getByCandidature(Candidature candidature);
    AdministrativeFile updatePaymentMethod(Integer fileId, PaymentMethod paymentMethod);
    AdministrativeFile uploadPaymentReceipt(Integer fileId, MultipartFile file) throws IOException;
    AdministrativeFile uploadCheques(Integer fileId, MultipartFile file) throws IOException;
    boolean existsByCandidature(Candidature candidature);
    List<AdministrativeFile> getAdminFilesByUserId(Long userId);
    AdministrativeFile updateStatus(Integer fileId, FileStatus newStatus);
    List<AdministrativeFile> getAllAdminFiles();
    AdministrativeFile getById(Integer fileId);
    Optional<AdministrativeFile> getByCandidatureId(Integer candidatureId);

}
