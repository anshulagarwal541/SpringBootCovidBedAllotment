package com.rachit.covid_beds.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String description;
    private int rating;
    @OneToOne
    @JoinColumn(name = "userInfo_id", nullable = false)
    private UserInfo userInfo;
    @OneToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}
