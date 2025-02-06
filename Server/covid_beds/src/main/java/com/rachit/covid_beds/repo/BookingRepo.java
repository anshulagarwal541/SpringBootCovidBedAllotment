package com.rachit.covid_beds.repo;


import com.rachit.covid_beds.model.Booking;
import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Integer> {
    Booking findByBookedDate(String bookedDate);

    List<Booking> findAllByHospital(Hospital hospital);

    List<Booking> findAllByUserInfo(UserInfo info);

    List<Booking> findAllByUserInfoAndHospital(UserInfo userInfo, Hospital hospital);
}
