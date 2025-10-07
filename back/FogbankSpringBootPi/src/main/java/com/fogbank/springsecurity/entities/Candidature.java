package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
public class Candidature implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDate dateDepot;
    @Enumerated(EnumType.STRING)
    private StatutCandidature statut;
    private String nom;
    private String prenom;
    private String idEsprit;
    private String phone;
    private String email;
    private String emailesprit;
    private String emailpersonel;

    private String CV;
    private String lettreMotivation;
    private String autreDocs;

    @Enumerated(EnumType.STRING)
    private AnneeEtude anneeActuelle;
    @Enumerated(EnumType.STRING)
    private OptionEtude optionActuelle;
    private boolean creditsNonValides;
    @Enumerated(EnumType.STRING)
    private LangueStatus niveauLangue;

    private double moyenne1A;
    private double moyenne2A;
    private double moyenne3A;
    private double moyenne4A;
    private double moyenne5A;

    private Double score;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] cvData;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] lettreMotivationData;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] autreDocsData;

    @ManyToOne
    @JsonBackReference(value = "offre-candidature")
    private Offre offre;

    @ManyToOne
    @JsonBackReference(value = "user-candidature")
    private User user;

    @OneToOne(mappedBy = "candidature", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "candidature-administrative-file")
    private AdministrativeFile administrativeFile;

    @OneToOne(mappedBy = "candidature", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "candidature-acceptance-proof")
    private AcceptanceProof acceptanceProof;

    @OneToOne(mappedBy = "candidature", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"candidature"})
    private MobilityProcess mobilityProcess;

}
