package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTServiceImpl implements JWTService {

    private Key getSiginKey() {
        byte[] key = Decoders.BASE64.decode("413F4428472B4B6250655368566D5970337336763979244226452948404D6351");
        return Keys.hmacShaKeyFor(key);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSiginKey()).build().parseClaimsJws(token).getBody();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        User user = (User) userDetails; // Cast UserDetails to your User entity
        int id = user.getId();
        // Extract user information from User entity
        String username = user.getUsername();
        String email = user.getEmail();
        String firstname = user.getFirstname();
        String lastname = user.getLastname();
        String role = user.getRole().name(); // Assuming Role is an enum

        // Set claims with custom user information
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("id", id);
        claims.put("email", email);
        claims.put("firstname", firstname);
        claims.put("lastname", lastname);
        claims.put("role", role);

        // Set token expiration
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + 604800000); // 7 days in milliseconds

        // Generate and sign the token
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getSiginKey(), SignatureAlgorithm.HS384)
                .compact();
    }

    @Override
      public String generateRefreshToken(Map<String, Object> extraclaims, UserDetails user) {
        return Jwts.builder()
                .setClaims(extraclaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 604800000)) // 7 days in milliseconds
                .signWith(getSiginKey(), SignatureAlgorithm.HS384)
                .compact();
    }
}
