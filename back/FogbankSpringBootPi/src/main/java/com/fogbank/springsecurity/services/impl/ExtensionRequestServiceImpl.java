package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.ExtensionRequestRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.ExtensionRequest;
import com.fogbank.springsecurity.entities.ExtensionStatus;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.IExtensionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExtensionRequestServiceImpl implements IExtensionRequestService {
    private final ExtensionRequestRepository extensionRequestRepository;
    private final UserRepository userRepository;
    private final Path rootLocation = Paths.get("uploads/extension-requests");

    @Override
    public ExtensionRequest createExtensionRequest(ExtensionRequest request, Integer studentId, MultipartFile file) {
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Handle file upload if provided
            if (file != null && !file.isEmpty()) {
                if (!Files.exists(rootLocation)) {
                    Files.createDirectories(rootLocation);
                }

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path destinationFile = rootLocation.resolve(fileName);
                Files.copy(file.getInputStream(), destinationFile);

                request.setFileName(fileName);
                request.setFilePath(destinationFile.toString());
                request.setOriginalFileName(file.getOriginalFilename());
            }

            request.setStudent(student);
            return extensionRequestRepository.save(request);

        } catch (IOException e) {
            throw new RuntimeException("Failed to create extension request: " + e.getMessage());
        }
    }

    @Override
    public List<ExtensionRequest> getStudentExtensionRequests(Integer studentId) {
        return extensionRequestRepository.findByStudentId(studentId.longValue());
    }

    @Override
    public List<ExtensionRequest> getAllExtensionRequests() {
        return extensionRequestRepository.findAllByOrderBySubmissionDateDesc();
    }

    @Override
    public List<ExtensionRequest> getExtensionRequestsByStatus(ExtensionStatus status) {
        return extensionRequestRepository.findByStatus(status);
    }

    @Override
    public ExtensionRequest getExtensionRequestById(Long requestId) {
        return extensionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Extension request not found"));
    }

    @Override
    public ExtensionRequest updateRequestStatus(Long requestId, ExtensionStatus status, String adminResponse) {
        ExtensionRequest request = getExtensionRequestById(requestId);
        request.setStatus(status);
        request.setAdminResponse(adminResponse);
        request.setResponseDate(LocalDateTime.now());
        return extensionRequestRepository.save(request);
    }

    @Override
    public byte[] downloadRequestFile(Long requestId) {
        ExtensionRequest request = getExtensionRequestById(requestId);
        if (request.getFileName() == null) {
            throw new RuntimeException("No file attached to this request");
        }

        try {
            return Files.readAllBytes(Paths.get(request.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    @Override
    public void deleteExtensionRequest(Long requestId) {
        ExtensionRequest request = getExtensionRequestById(requestId);

        // Delete file if exists
        if (request.getFileName() != null) {
            try {
                Files.deleteIfExists(Paths.get(request.getFilePath()));
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete file: " + e.getMessage());
            }
        }

        extensionRequestRepository.delete(request);
    }
}
