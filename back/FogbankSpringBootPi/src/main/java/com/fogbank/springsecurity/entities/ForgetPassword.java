package com.fogbank.springsecurity.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder

public class ForgetPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )

    private Integer fpid ;
    @Column(nullable = false)
    private Integer otp ;
    @Column(nullable = false)
    private Date expirationtime  ;
    @OneToOne
    private User user ;

}
