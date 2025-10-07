package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.dto.JwtAuthenticationResponse;
import com.fogbank.springsecurity.dto.RefreshTokenRequest;
import com.fogbank.springsecurity.dto.SignUpRequest;
import com.fogbank.springsecurity.dto.SigninRequest;
import com.fogbank.springsecurity.entities.User;

import java.io.IOException;

public interface AuthenticationService {

    User signup(SignUpRequest signUpRequest) throws IOException;
    User signupAdmin(SignUpRequest signUpRequest) throws IOException;
    JwtAuthenticationResponse signin(SigninRequest signinRequest)   ;
    JwtAuthenticationResponse refreshtoken(RefreshTokenRequest refreshTokenRequest)     ;

    User getuserfromauthentication();

}
