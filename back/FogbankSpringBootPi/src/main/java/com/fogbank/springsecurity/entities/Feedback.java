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
@Table(name = "mobility_feedback")
public class Feedback implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime submissionDate;

    // Ratings (1-5 stars)
    private Integer qualityOfCourses;
    private Integer academicInfrastructure;
    private Integer accommodation;
    private Integer campusLife;
    private Integer culturalAdaptation;
    private Integer administrativeSupport;
    private Integer costOfLiving;
    private Integer locationAccessibility;
    private Integer globalSatisfaction;

    // Optional text feedback
    @Column(length = 1000)
    private String additionalComments;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"feedbacks", "password", "authorities"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "offer_id")
    @JsonIgnoreProperties({"feedbacks", "candidatures"})
    private Offre offer;

    @PrePersist
    protected void onCreate() {
        submissionDate = LocalDateTime.now();
    }

    // Validation method
    public boolean isValid() {
        return qualityOfCourses != null && qualityOfCourses >= 1 && qualityOfCourses <= 5 &&
                academicInfrastructure != null && academicInfrastructure >= 1 && academicInfrastructure <= 5 &&
                accommodation != null && accommodation >= 1 && accommodation <= 5 &&
                campusLife != null && campusLife >= 1 && campusLife <= 5 &&
                culturalAdaptation != null && culturalAdaptation >= 1 && culturalAdaptation <= 5 &&
                administrativeSupport != null && administrativeSupport >= 1 && administrativeSupport <= 5 &&
                costOfLiving != null && costOfLiving >= 1 && costOfLiving <= 5 &&
                locationAccessibility != null && locationAccessibility >= 1 && locationAccessibility <= 5 &&
                globalSatisfaction != null && globalSatisfaction >= 1 && globalSatisfaction <= 5;
    }
}
