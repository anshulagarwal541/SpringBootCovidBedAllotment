package com.rachit.covid_beds.service;

import com.rachit.covid_beds.model.Booking;
import com.rachit.covid_beds.model.User;
import com.rachit.covid_beds.model.UserInfo;
import com.rachit.covid_beds.repo.UserInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInfoService {

    @Autowired
    private UserInfoRepo userInfoRepo;
    @Autowired
    private UserService userService;

    public void saveUserInfoByUserInfo(UserInfo info) {
        userInfoRepo.save(info);
    }

    public UserInfo getUserInfoByUser(User user) {
        return userInfoRepo.findByUser(user);
    }

    public void updateUserInfoByUserInfo(UserInfo userInfo) {
        User user = userService.getUserByEmail(userInfo.getUser().getEmail());
        userInfo.setUser(user);
        UserInfo info = userInfoRepo.findByUser(user);
        info.setName(userInfo.getName());
        userInfoRepo.save(info);
    }
}
