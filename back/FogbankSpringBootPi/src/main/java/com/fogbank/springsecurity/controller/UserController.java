package com.fogbank.springsecurity.controller;


import com.fogbank.springsecurity.entities.Profile;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.AuthenticationService;
import com.fogbank.springsecurity.services.ProfileService;
import com.fogbank.springsecurity.services.UserService;
import com.fogbank.springsecurity.services.impl.AuthenticationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*",maxAge = 3600)

public class UserController {








    @Autowired
    private UserService userService ;


    @Autowired
    private   AuthenticationService authenticationService ;


    @GetMapping("/getuser/{id}")
    public User getUser(@PathVariable Integer id) {
        return this.userService.getUser(id);
    }


    @GetMapping
    public ResponseEntity<String> sayHello()
    {
      User user= authenticationService.getuserfromauthentication();
        return ResponseEntity.ok(user.toString()) ;

    }


    @PostMapping(value="/{id}/photo", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadUserPhoto(@PathVariable("id") Integer id, @RequestParam("photo") MultipartFile photo) throws IOException {
        // Call your service method to handle the photo upload

                byte[] photoBytes = null;
                if (!photo.isEmpty()) {
                    photoBytes = photo.getBytes();
                }


        userService.uploadUserPhoto(id, photoBytes);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/users/{userId}/photo")
    public ResponseEntity<byte[]> getUserPhoto(@PathVariable Integer userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            byte[] photo = user.getPhoto();
            if (photo != null && photo.length > 0) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG); // Assuming image type is JPEG
                return new ResponseEntity<>(photo, headers, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }



    @PutMapping("/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User updatedUser = userService.updateUserSelective(user);
        System.out.println(updatedUser);

        if (updatedUser != null)
        {
            System.out.println("User updated");
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }








}
