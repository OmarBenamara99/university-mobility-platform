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
@ToString(exclude = {"paymentReceiptData", "chequesData"}) // Prevent large data from logging
public class AdministrativeFile implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Tracks when the student started this step and last updated
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private FileStatus status;

    // --- File Storage for Immediate Payment ---
    private String paymentReceiptFilename;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] paymentReceiptData;

    // --- File Storage for Cheques ---
    // For multiple cheques, we can store them as a single PDF or ZIP, or as a JSON string of filenames.
    // This simple approach stores one file containing all cheques.
    private String chequesFilename;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] chequesData;
    // ------------------------------------------

    // Critical: Link to the ONE accepted and confirmed candidature
    // This is a One-To-One relationship because one candidature leads to one administrative file.

    @OneToOne
    @JoinColumn(name = "candidature_id") // Creates a foreign key column in this table
    @JsonBackReference(value = "candidature-administrative-file") // Prevents infinite loop in JSON
    private Candidature candidature;
}
