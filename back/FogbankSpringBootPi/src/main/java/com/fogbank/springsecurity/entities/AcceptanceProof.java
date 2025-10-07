package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@ToString(exclude = "acceptanceDocumentData")
public class AcceptanceProof implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    @Enumerated(EnumType.STRING)
    private ProofStatus status;

    // Document information
    private String documentFilename;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] acceptanceDocumentData;

    // Link to the candidature (One-to-One relationship)
    @OneToOne
    @JoinColumn(name = "candidature_id")
    @JsonBackReference(value = "candidature-acceptance-proof")
    private Candidature candidature;

}
