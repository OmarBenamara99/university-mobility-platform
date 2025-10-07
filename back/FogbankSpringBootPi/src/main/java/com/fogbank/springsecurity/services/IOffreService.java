package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.OfferDiscussionGroup;
import com.fogbank.springsecurity.entities.Offre;

import java.util.List;
import java.util.Optional;

public interface IOffreService {
    List<Offre> getAllOffres();
    Offre addOffre(Offre offre);
    Offre updateOffre(Offre offre);
    public void deleteOffre(Integer id);
    Offre getOffreById(Integer id);

    List<Offre> getAllOffresWithCandidatures();
    List<Offre> getOffresWithCandidaturesByUser(Long userId);
    Optional<OfferDiscussionGroup> getDiscussionGroupByOfferId(Long offerId);

}
