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
@ToString
public class MobilityProcess implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    // Link to the FINAL accepted candidature
    @OneToOne
    @JoinColumn(name = "candidature_id")
    @JsonIgnoreProperties({"mobilityProcess"})
    private Candidature candidature;

    // Simple status to track if student has access
    private boolean hasAccessToPreparation;
}
