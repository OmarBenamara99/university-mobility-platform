package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository ;
    @Override
    public  UserDetailsService userDetailsService ()
    {
        return  new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username)
                    {
                return userRepository.findByEmail(username).orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
            }
        };
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    @Override
    public void removeUser(Integer   idUser) {

        userRepository.deleteById(idUser);

    }

    @Override
    public User getUser(Integer idUser) {
        return userRepository.findById(idUser).orElse(null);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUserSelective(User user) {
        return userRepository.findById(user.getId()).map(existingUser -> {
            if(user.getAddress() != null) existingUser.setAddress(user.getAddress());
            if(user.getBio() != null) existingUser.setBio(user.getBio());
            if(user.getEmail() != null) existingUser.setEmail(user.getEmail());
            if(user.getFirstname() != null) existingUser.setFirstname(user.getFirstname());
            if(user.getLastname() != null) existingUser.setLastname(user.getLastname());
            if(user.getMobilePhone() != null) existingUser.setMobilePhone(user.getMobilePhone());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
    }

    @Override
    public void uploadUserPhoto(Integer idUser, byte[] photo) {

        User user =userRepository.findById(idUser).get();
        user.setPhoto(photo);
        userRepository.save(user);


    }


}
