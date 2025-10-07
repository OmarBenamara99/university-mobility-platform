package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
}
