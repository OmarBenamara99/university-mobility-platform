package com.fogbank.springsecurity.dto;


import lombok.Data;

@Data
public class JwtAuthenticationResponse {


    private String token ;
    private String refreshToken ;
}
