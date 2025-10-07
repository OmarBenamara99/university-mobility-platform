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
@Table(name = "reclamation")
public class Reclamation implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Column(length = 2000)
    private String description;

    private LocalDateTime submissionDate;

    private String adminResponse;

    private LocalDateTime responseDate;

    private boolean resolved = false;

    // Relationships
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"reclamations", "password", "authorities"})
    private User student;

    @PrePersist
    protected void onCreate() {
        submissionDate = LocalDateTime.now();
    }

    public void setAdminResponse(String response) {
        this.adminResponse = response;
        this.responseDate = LocalDateTime.now();
        this.resolved = true;
    }
}
