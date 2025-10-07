package com.fogbank.springsecurity.utils;

import com.fogbank.springsecurity.Repository.GeneralDiscussionGroupRepository;
import com.fogbank.springsecurity.entities.GeneralDiscussionGroup;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DiscussionGroupInitializer {
    @Autowired
    private GeneralDiscussionGroupRepository generalDiscussionGroupRepository;

    @PostConstruct
    public void init() {
        // Create general group if it doesn't exist
        if (generalDiscussionGroupRepository.count() == 0) {
            GeneralDiscussionGroup generalGroup = GeneralDiscussionGroup.builder()
                    .name("Espace Discussion Général")
                    .description("Discutez avec tous les étudiants en mobilité")
                    .createdAt(LocalDateTime.now())
                    .build();
            generalDiscussionGroupRepository.save(generalGroup);
            System.out.println("General discussion group created with ID: " + generalGroup.getId());
        }
    }
}
