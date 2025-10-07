package com.fogbank.springsecurity.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


@Entity
@Data
@Table(name = "User")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;
    private String firstname ;
    private String lastname ;
    private String password ;
    private String email ;
    private Role role ;
    private String bio;
    private String address;
    private String mobilePhone;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] photo;




    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-candidature")
    private List<Candidature> candidatures;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"sender"})
    private List<Message> sentMessages = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "user")
    private ForgetPassword forgetPassword ;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "Hello! This is a User object with the following details:\n" +
                "ID: " + id + "\n" +
                "Name: " + firstname + " " + lastname + "\n" +
                "Email: " + email + "\n" +
                "Role: " + role.name() +
                "Bio: " + bio +
                "Address: " + address +
                "Mobile Phone: " + mobilePhone +
                "\nThank you!";
    }


}
