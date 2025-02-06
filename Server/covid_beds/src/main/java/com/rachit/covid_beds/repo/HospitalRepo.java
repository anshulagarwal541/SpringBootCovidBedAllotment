package com.rachit.covid_beds.repo;

import com.rachit.covid_beds.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepo extends JpaRepository<Hospital, Integer> {
    Hospital findByLongitudeAndLatitude(double longitude, double latitude);
}
