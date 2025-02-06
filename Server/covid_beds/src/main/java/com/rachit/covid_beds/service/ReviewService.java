package com.rachit.covid_beds.service;

import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.model.Review;
import com.rachit.covid_beds.model.UserInfo;
import com.rachit.covid_beds.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    public void postReview(Review review) {
        reviewRepo.save(review);
    }

    public Review getReviewByUserInfoAndHospital(UserInfo userInfo, Hospital hospital) {
        return reviewRepo.findByUserInfoAndHospital(userInfo, hospital);
    }

    public List<Review> getReviewByHospital(Hospital hospital) {
        return reviewRepo.findAllByHospital(hospital);
    }
}
