package com.fogbank.springsecurity.controller;

import com.fogbank.springsecurity.dto.JwtAuthenticationResponse;
import com.fogbank.springsecurity.dto.RefreshTokenRequest;
import com.fogbank.springsecurity.dto.SignUpRequest;
import com.fogbank.springsecurity.dto.SigninRequest;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge=3600)

public class AuthenticationController {


    private  final AuthenticationService authenticationService ;
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignUpRequest signUpRequest) throws IOException {
        return ResponseEntity.ok(authenticationService.signup(signUpRequest))  ;
    }

    @PostMapping("/signupAdmin")
    public ResponseEntity<User> signupAdmin(@RequestBody SignUpRequest signUpRequest) throws IOException {
        return ResponseEntity.ok(authenticationService.signupAdmin(signUpRequest))  ;
    }



    @PostMapping("/signin")
    public  ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest)
    {
        return  ResponseEntity.ok(authenticationService.signin(signinRequest)) ;
    }
    @PostMapping("/refresh")
    public  ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody RefreshTokenRequest refreshTokenRequest)
    {
        return  ResponseEntity.ok(authenticationService.refreshtoken(refreshTokenRequest)) ;
    }


}
