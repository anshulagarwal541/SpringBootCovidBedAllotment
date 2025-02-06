package com.rachit.covid_beds.controller;

import com.rachit.covid_beds.error.ErrorComponent;
import com.rachit.covid_beds.jwt.JwtService;
import com.rachit.covid_beds.model.User;
import com.rachit.covid_beds.model.UserInfo;
import com.rachit.covid_beds.service.UserInfoService;
import com.rachit.covid_beds.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserInfoService userInfoService;

    @GetMapping("")
    public ResponseEntity<?> home() {
        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }

    @PostMapping("/login/admin")
    public ResponseEntity<?> adminLogin(@RequestBody User user) {
        User adminUser = userService.getUserByEmail(user.getEmail());
        if (!adminUser.getRoles().contains("ADMIN")) {
            return new ResponseEntity<>(new ErrorComponent("Admin not found in database"), HttpStatus.NOT_FOUND);
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return new ResponseEntity<>(jwtService.generateToken(user.getEmail()), HttpStatus.OK);
        }
        return new ResponseEntity<>("Failure", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/login/user")
    public ResponseEntity<?> userLogin(@RequestBody User user) {
        try {
            User adminUser = userService.getUserByEmail(user.getEmail());
            if (!adminUser.getRoles().contains("USER")) {
                return new ResponseEntity<>(new ErrorComponent("User not found in database"), HttpStatus.NOT_FOUND);
            }
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            if (authentication.isAuthenticated()) {
                return new ResponseEntity<>(jwtService.generateToken(user.getEmail()), HttpStatus.OK);
            }
            return new ResponseEntity<>(new ErrorComponent("User not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody UserInfo info) {
        try {
            User user = userService.getUserByEmail(info.getUser().getEmail());
            if (user != null) {
                return new ResponseEntity<>(new ErrorComponent("User has already registered."), HttpStatus.FORBIDDEN);
            }
            if (info.getUser().getEmail() == "" || info.getUser().getPassword() == "") {
                return new ResponseEntity<>(new ErrorComponent("email and password cannot be empty"), HttpStatus.BAD_REQUEST);
            }
            if (info.getName() == "") {
                return new ResponseEntity<>(new ErrorComponent("name cannot be empty"), HttpStatus.BAD_REQUEST);
            }
            if (String.valueOf(info.getPhone()).length() != 10) {
                return new ResponseEntity<>(new ErrorComponent("Phone number should be of 10 digits"), HttpStatus.BAD_REQUEST);
            }
            String password = info.getUser().getPassword();
            userService.postUserByUser(info.getUser());
            user = userService.getUserByEmail(info.getUser().getEmail());
            info.setUser(user);
            userInfoService.saveUserInfoByUserInfo(info);
            System.out.println("************");
            System.out.println(info);
            System.out.println("************");
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(info.getUser().getEmail(), password));
            if (authentication.isAuthenticated()) {
                return new ResponseEntity<>(jwtService.generateToken(info.getUser().getEmail()), HttpStatus.OK);
            }
            return new ResponseEntity<>(new ErrorComponent("User not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/load/admin")
    public ResponseEntity<?> loadAdmin(@RequestBody User user) {
        userService.postUserByUser(user);
        return new ResponseEntity<>("Admin added", HttpStatus.OK);
    }

}
