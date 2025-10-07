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
public class OrdreMission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String originalFileName;
    private LocalDateTime uploadedAt;

    @Lob
    @Column(columnDefinition = "LONGBLOB") // ← ADD THIS
    private byte[] fileData;

    // Each Ordre de Mission is linked to a specific offer
    @OneToOne
    @JoinColumn(name = "offer_id")
    @JsonIgnoreProperties({"ordreMission", "candidatures"})
    private Offre offer;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
