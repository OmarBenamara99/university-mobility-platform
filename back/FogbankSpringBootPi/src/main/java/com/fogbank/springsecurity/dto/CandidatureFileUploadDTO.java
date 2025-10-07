package com.fogbank.springsecurity.dto;

import com.fogbank.springsecurity.entities.AnneeEtude;
import com.fogbank.springsecurity.entities.LangueStatus;
import com.fogbank.springsecurity.entities.OptionEtude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CandidatureFileUploadDTO {
    // Personal information
    private String nom;
    private String prenom;
    private String idEsprit;
    private String phone;
    private String email;
    private String emailesprit;
    private String emailpersonel;
    // Academic information
    private AnneeEtude anneeActuelle;
    private OptionEtude optionActuelle;
    private boolean creditsNonValides;
    private LangueStatus niveauLangue;
    // Grades
    private double moyenne1A;
    private double moyenne2A;
    private double moyenne3A;
    private double moyenne4A;
    private double moyenne5A;

    // Relationships (as IDs)
    private Integer offreId;
    private Integer userId;

    // File uploads
    private MultipartFile cvFile;
    private MultipartFile lettreMotivationFile;
    private MultipartFile autreDocsFile;
}
