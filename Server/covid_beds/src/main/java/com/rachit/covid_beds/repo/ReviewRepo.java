package com.rachit.covid_beds.repo;

import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.model.Review;
import com.rachit.covid_beds.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Integer> {
    Review findByUserInfoAndHospital(UserInfo userInfo, Hospital hospital);

    List<Review> findAllByHospital(Hospital hospital);

}
