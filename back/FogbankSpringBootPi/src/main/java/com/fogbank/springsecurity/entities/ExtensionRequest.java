package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "extension_requests")
public class ExtensionRequest implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ExtensionStatus status;

    private String fileName;
    private String filePath;
    private String originalFileName;
    private LocalDateTime submissionDate;
    private LocalDateTime responseDate;
    private String adminResponse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"extensionRequests", "password", "authorities"})
    private User student;

    @PrePersist
    protected void onCreate() {
        submissionDate = LocalDateTime.now();
        status = ExtensionStatus.PENDING; // Default status
    }
}
