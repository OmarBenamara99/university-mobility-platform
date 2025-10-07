package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.ExtensionRequest;
import com.fogbank.springsecurity.entities.ExtensionStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IExtensionRequestService {
    ExtensionRequest createExtensionRequest(ExtensionRequest request, Integer studentId, MultipartFile file);
    List<ExtensionRequest> getStudentExtensionRequests(Integer studentId);
    List<ExtensionRequest> getAllExtensionRequests();
    List<ExtensionRequest> getExtensionRequestsByStatus(ExtensionStatus status);
    ExtensionRequest getExtensionRequestById(Long requestId);
    ExtensionRequest updateRequestStatus(Long requestId, ExtensionStatus status, String adminResponse);
    byte[] downloadRequestFile(Long requestId);
    void deleteExtensionRequest(Long requestId);
}
