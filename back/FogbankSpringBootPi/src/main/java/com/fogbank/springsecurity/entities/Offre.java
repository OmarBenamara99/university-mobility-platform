package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
public class Offre implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String titre;
    private String description;
    @Enumerated(EnumType.STRING)
    private OffreType type;
    @Enumerated(EnumType.STRING)
    private Universite universite;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private List<OptionEsprit> optionsConcernees;


    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private List<FieldDisponible> fieldsDisponibles;

    @Enumerated(EnumType.STRING)
    private Pays pays;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private int nombrePlaces;
    private boolean active;

    @ElementCollection
    private List<String> imageUrls;

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "offre-candidature")
    private List<Candidature> candidatures;

    // Add this relationship
    @OneToOne(mappedBy = "offer", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"offer"})
    private OrdreMission ordreMission;
}
