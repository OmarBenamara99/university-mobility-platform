package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.OfferDiscussionGroupRepository;
import com.fogbank.springsecurity.Repository.OffreRepository;
import com.fogbank.springsecurity.entities.OfferDiscussionGroup;
import com.fogbank.springsecurity.entities.Offre;
import com.fogbank.springsecurity.services.IOffreService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OffreServiceImpl implements IOffreService {
    OffreRepository offreRepository;
    private final OfferDiscussionGroupRepository offerDiscussionGroupRepository;

    @Override
    public List<Offre> getAllOffres() { return offreRepository.findAll(); }

    @Override
    @Transactional
    public Offre addOffre(Offre offre) {
        // First, save the offer without the discussion group
        Offre savedOffre = offreRepository.save(offre);
        // Then create a discussion group for this offer
        OfferDiscussionGroup discussionGroup = OfferDiscussionGroup.builder()
                .name("Discussion - " + offre.getTitre())
                .description("Espace de discussion pour l'offre: " + offre.getTitre())
                .offer(savedOffre)
                .build();

        offerDiscussionGroupRepository.save(discussionGroup);


        return savedOffre;
    }
    // Add this method to get discussion group by offer ID
    @Override
    public Optional<OfferDiscussionGroup> getDiscussionGroupByOfferId(Long offerId) {
        return offerDiscussionGroupRepository.findByOfferId(offerId);
    }


    @Override
    public Offre updateOffre(Offre offre) { return offreRepository.save(offre); }

    @Override
    public void deleteOffre(Integer id) {
        if(offreRepository.existsById(id)){offreRepository.deleteById(id);
            System.out.println("Club with ID " + id + " has been deleted successfully.");}
        else {System.out.println("Club with ID " + id + " does not exist.");}
    }

    @Override
    public Offre getOffreById(Integer id) { return offreRepository.findById(id).orElse(null); }

    @Override
    public List<Offre> getAllOffresWithCandidatures() { return offreRepository.findAllWithCandidatures(); }

    @Override
    public List<Offre> getOffresWithCandidaturesByUser(Long userId) {
        return offreRepository.findOffresWithCandidaturesByUserId(userId);
    }




}
