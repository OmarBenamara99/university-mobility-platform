package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.GeneralDiscussionGroupRepository;
import com.fogbank.springsecurity.Repository.MessageRepository;
import com.fogbank.springsecurity.Repository.OfferDiscussionGroupRepository;
import com.fogbank.springsecurity.entities.GeneralDiscussionGroup;
import com.fogbank.springsecurity.entities.Message;
import com.fogbank.springsecurity.entities.OfferDiscussionGroup;
import com.fogbank.springsecurity.services.IMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements IMessageService {
    private final MessageRepository messageRepository;
    private final GeneralDiscussionGroupRepository generalDiscussionGroupRepository;
    private final OfferDiscussionGroupRepository offerDiscussionGroupRepository;


    @Override
    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }





    // ADD THESE TWO NEW METHOD IMPLEMENTATIONS:
    @Override
    public Message sendMessageToCommonGroup(Message message) {
        // FIND THE COMMON GROUP AND ASSIGN IT
        GeneralDiscussionGroup commonGroup = generalDiscussionGroupRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Common discussion group not found"));

        message.setDiscussionGroup(commonGroup); // SET THE COMMON GROUP
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getAllMessages() {
        // Get messages for the common group
        GeneralDiscussionGroup commonGroup = generalDiscussionGroupRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Common discussion group not found"));

        return messageRepository.findByDiscussionGroupIdOrderByTimestampAsc(commonGroup.getId());
    }


    // NEW: Send message to offer-specific group
    public Message sendMessageToOfferGroup(Message message, Long offerId) {
        OfferDiscussionGroup offerGroup = offerDiscussionGroupRepository.findByOfferId(offerId)
                .orElseThrow(() -> new RuntimeException("Discussion group not found for offer: " + offerId));

        message.setOfferDiscussionGroup(offerGroup);
        return messageRepository.save(message);
    }

    // NEW: Get messages for offer-specific group
    public List<Message> getMessagesByOfferId(Long offerId) {
        return messageRepository.findByOfferDiscussionGroup_Offer_IdOrderByTimestampAsc(offerId);
    }
}