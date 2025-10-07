package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.OfferDiscussionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfferDiscussionGroupRepository extends JpaRepository<OfferDiscussionGroup, Long> {
    Optional<OfferDiscussionGroup> findByOfferId(Long offerId);
    boolean existsByOfferId(Long offerId);
}
