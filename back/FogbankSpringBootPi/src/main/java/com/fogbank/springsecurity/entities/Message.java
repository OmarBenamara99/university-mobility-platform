package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private LocalDateTime timestamp;

    // User who sent the message
    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonIgnoreProperties({"sentMessages", "receivedMessages"})
    private User sender;

    // Pre-persist to set timestamp automatically
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "general_group_id")
    @JsonIgnoreProperties({"messages", "role"}) // Prevent circular reference
    private GeneralDiscussionGroup discussionGroup;

    // For offer-specific discussions (new)
    @ManyToOne
    @JoinColumn(name = "offer_group_id")
    @JsonIgnoreProperties({"messages"})
    private OfferDiscussionGroup offerDiscussionGroup;
}
