package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {


    List<Message> findByDiscussionGroupIdOrderByTimestampAsc(Long groupId);
    List<Message> findByOfferDiscussionGroup_Offer_IdOrderByTimestampAsc(Long offerId); // NEW

}
