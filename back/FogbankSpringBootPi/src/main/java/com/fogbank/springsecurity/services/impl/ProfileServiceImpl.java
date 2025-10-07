package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.ProfileRepository;
import com.fogbank.springsecurity.entities.Profile;
import com.fogbank.springsecurity.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

  private final ProfileRepository profileRepository;
    @Override
    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile);
    }
}
