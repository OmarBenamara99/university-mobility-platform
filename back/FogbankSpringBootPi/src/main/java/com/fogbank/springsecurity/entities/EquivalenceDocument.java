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
@Table(name = "equivalence_document")
public class EquivalenceDocument implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;
    private String originalFileName;
    private LocalDateTime uploadDate;
    @Enumerated(EnumType.STRING)
    private DocumentType type;

    // Relationships
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offer_id")
    @JsonIgnoreProperties({"equivalenceDocuments", "candidatures"})
    private Offre offer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"equivalenceDocuments", "password", "authorities"})
    private User student;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}
