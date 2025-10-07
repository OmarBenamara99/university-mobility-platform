package com.fogbank.springsecurity.services.impl;


import com.fogbank.springsecurity.dto.MailBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service

public class EmailService {

    @Autowired
    private  JavaMailSender javaMailSender ;
    public EmailService(JavaMailSender javaMailSender)
    {
        this.javaMailSender=javaMailSender  ;
    }

    public void sendSimpleMessage(MailBody mailBody)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());
        javaMailSender.send(message);
    }
}
