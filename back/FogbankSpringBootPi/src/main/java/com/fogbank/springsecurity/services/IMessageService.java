package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.Message;

import java.util.List;

public interface IMessageService {
    Message sendMessage(Message message);

    // ADD THESE TWO NEW METHODS:
    List<Message> getAllMessages();
    Message sendMessageToCommonGroup(Message message);
    // NEW METHODS FOR OFFER-SPECIFIC GROUPS
    Message sendMessageToOfferGroup(Message message, Long offerId);
    List<Message> getMessagesByOfferId(Long offerId);

}
