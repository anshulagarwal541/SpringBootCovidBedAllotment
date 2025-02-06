package com.rachit.covid_beds.service;

import com.rachit.covid_beds.model.User;
import com.rachit.covid_beds.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void postUserByUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public void updateUserByUser(User user) {
        User u = userRepo.findById(user.getId()).orElse(new User());
        if (u.getEmail() != "") {
            u.setEmail(user.getEmail());
            userRepo.save(u);
        }
    }

    public void updateUserPasswordByUser(User user) {
        User currentUser=userRepo.findByEmail(user.getEmail());
        currentUser.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(currentUser);
    }
}
