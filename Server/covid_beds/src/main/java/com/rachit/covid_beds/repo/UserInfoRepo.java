package com.rachit.covid_beds.repo;

import com.rachit.covid_beds.model.User;
import com.rachit.covid_beds.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepo extends JpaRepository<UserInfo, Integer> {

    UserInfo findByUser(User user);
}
