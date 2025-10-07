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
public class OfferDiscussionGroup implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime createdAt;

    // Link to the offer
    @OneToOne
    @JoinColumn(name = "offer_id")
    @JsonIgnoreProperties({"discussionGroup", "candidatures"})
    private Offre offer;

    @OneToMany(mappedBy = "offerDiscussionGroup", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"offerDiscussionGroup", "sender"})
    private List<Message> messages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
