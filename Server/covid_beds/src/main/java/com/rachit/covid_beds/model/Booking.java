package com.rachit.covid_beds.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    public enum Status{
        ONGOING, COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;
    @ManyToOne
    @JoinColumn(name = "userInfo_id", nullable = false)
    private UserInfo userInfo;
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    private int beds;
    private int totalCost;
    private String bookedDate;
    @Enumerated(EnumType.STRING)
    private Status status=Status.ONGOING;

}
