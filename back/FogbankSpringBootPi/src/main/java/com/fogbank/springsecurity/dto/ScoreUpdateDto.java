package com.fogbank.springsecurity.dto;

import com.fogbank.springsecurity.entities.StatutCandidature;

public record ScoreUpdateDto(Integer id,
                             Double score,
                             StatutCandidature statut) {
}
