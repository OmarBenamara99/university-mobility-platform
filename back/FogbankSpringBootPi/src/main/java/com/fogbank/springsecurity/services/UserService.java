package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.Profile;
import com.fogbank.springsecurity.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService  {


    public UserDetailsService userDetailsService();

    List<User> getAllUsers();
    Optional<User> getUserById(Integer userId);


    public void removeUser(Integer idUser);

    public User getUser(Integer idUser);
    User updateUser(User user) ;
     User updateUserSelective(User user) ;

     void uploadUserPhoto(Integer idUser, byte[] photo) ;




    }
