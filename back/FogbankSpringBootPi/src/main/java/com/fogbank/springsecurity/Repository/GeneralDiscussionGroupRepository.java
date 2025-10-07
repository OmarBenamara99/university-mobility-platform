package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.GeneralDiscussionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GeneralDiscussionGroupRepository extends JpaRepository<GeneralDiscussionGroup, Long> {
    Optional<GeneralDiscussionGroup> findFirstByOrderByIdAsc();

}
