package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneralDiscussionGroup implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name = "Espace Discussion Général";
    private String description = "Espace de discussion pour tous les étudiants en mobilité";
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "discussionGroup", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"discussionGroup", "sender"}) // Prevent circular reference
    private List<Message> messages = new ArrayList<>();
}
