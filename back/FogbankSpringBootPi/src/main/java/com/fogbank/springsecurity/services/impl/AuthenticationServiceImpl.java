package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.ProfileRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.dto.JwtAuthenticationResponse;
import com.fogbank.springsecurity.dto.RefreshTokenRequest;
import com.fogbank.springsecurity.dto.SignUpRequest;
import com.fogbank.springsecurity.dto.SigninRequest;
import com.fogbank.springsecurity.entities.Profile;
import com.fogbank.springsecurity.entities.Role;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.AuthenticationService;
import com.fogbank.springsecurity.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {


    private  final UserRepository userRepository  ;
    private final PasswordEncoder passwordEncoder  ;
    private final AuthenticationManager authenticationManager ;
    private final JWTService jwtService ;
    private final ProfileRepository profileRepository ;


    public User signup(SignUpRequest signUpRequest) throws IOException {
        User user = new User();

        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setRole(Role.USER);
        user.setBio("");
        user.setAddress("");
        user.setMobilePhone("");

        try {
            Path path = Paths.get("src/main/resources/static/images/user2.jpg");
            byte[] imageBytes = Files.readAllBytes(path);
            user.setPhoto(imageBytes);
        } catch (IOException e) {
            // Handle file read error
            // Log the error or throw a custom exception
            e.printStackTrace();
        }

        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return user;
    }
    public User signupAdmin(SignUpRequest signUpRequest) throws IOException {
        User user = new User();

        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setRole(Role.ADMIN);
        user.setBio("");
        user.setAddress("");
        user.setMobilePhone("");

        try {
            Path path = Paths.get("src/main/resources/static/images/user2.jpg");
            byte[] imageBytes = Files.readAllBytes(path);
            user.setPhoto(imageBytes);
        } catch (IOException e) {
            // Handle file read error
            // Log the error or throw a custom exception
            e.printStackTrace();
        }

        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return user;
    }


    public JwtAuthenticationResponse signin(SigninRequest signinRequest)
    {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),signinRequest.getPassword())) ;

    var user = userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"))  ;
    var jwt = jwtService.generateToken(user)  ;
    var refreshtoken = jwtService.generateRefreshToken(new HashMap<>()  ,user)  ;

    JwtAuthenticationResponse jwtAuthenticationResponse =new JwtAuthenticationResponse()  ;

     jwtAuthenticationResponse.setToken(jwt);
     jwtAuthenticationResponse.setRefreshToken(refreshtoken);

     return jwtAuthenticationResponse  ;
    }


    public JwtAuthenticationResponse refreshtoken(RefreshTokenRequest refreshTokenRequest)
    {
        String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());
        User user =  userRepository.findByEmail(userEmail).orElseThrow()  ;
        if (jwtService.isTokenValid(refreshTokenRequest.getToken(),user))
        {
            var jwt = jwtService.generateToken(user)  ;

            JwtAuthenticationResponse jwtAuthenticationResponse =new JwtAuthenticationResponse()  ;

            jwtAuthenticationResponse.setToken(jwt);
            jwtAuthenticationResponse.setRefreshToken(refreshTokenRequest.getToken());

            return jwtAuthenticationResponse  ;

        }

        return null  ;
    }

    @Override
    public User getuserfromauthentication() {
        Authentication authentication  = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user ;

        }
        return new User() ;
    }


}
