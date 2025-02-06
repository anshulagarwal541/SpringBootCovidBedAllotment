package com.rachit.covid_beds.controller;


import com.rachit.covid_beds.error.ErrorComponent;
import com.rachit.covid_beds.jwt.JwtService;
import com.rachit.covid_beds.model.*;
import com.rachit.covid_beds.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ReviewService reviewService;

    // GET REQUESTS

    @GetMapping({"", "/"})
    public ResponseEntity<?> getUser(HttpServletRequest req, HttpServletResponse res) {
        String authHeader = req.getHeader("Authorization");
        String token = null;
        String email = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            email = jwtService.extractUsername(token);
        }
        if (email != null) {
            User user = userService.getUserByEmail(email);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(new ErrorComponent("User not found with associated token"), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/details")
    public ResponseEntity<?> getDetails(HttpServletRequest req, HttpServletResponse res) {
        try {
            String authHeader = req.getHeader("Authorization");
            String email = null;
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                email = jwtService.extractUsername(token);
            }
            if (email != null) {
                User user = userService.getUserByEmail(email);
                UserInfo userInfo = userInfoService.getUserInfoByUser(user);
                if (userInfo.getName() == "") {
                    return new ResponseEntity<>(new ErrorComponent("User Details not found"), HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(userInfo, HttpStatus.OK);
            }
            return new ResponseEntity<>(new ErrorComponent("User not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/allHospitals")
    public ResponseEntity<?> getAllHospitals() {
        try {
            List<Hospital> allHospitals = hospitalService.getAllHospitals();
            return new ResponseEntity<>(allHospitals, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/hospital/{id}")
    public ResponseEntity<?> getHospital(@PathVariable("id") int id) {
        Hospital hospital = hospitalService.findHospitalById(id);
        if (hospital.getAddress() != null) {
            return new ResponseEntity<>(hospital, HttpStatus.OK);
        }
        return new ResponseEntity<>(new ErrorComponent("No Hospital found with the requested id"), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/hospital/{id}/bookings")
    public ResponseEntity<?> getHospitalBookings(@PathVariable("id") int id) {
        Hospital hospital = hospitalService.findHospitalById(id);
        if (hospital.getAddress() != null) {
            List<Booking> allBookings = bookingService.getBookingsByHospital(hospital);
            return new ResponseEntity<>(allBookings, HttpStatus.OK);
        }
        return new ResponseEntity<>(new ErrorComponent("No Hospital found with the requested id"), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/booking/record")
    public ResponseEntity<?> getUserBookings(HttpServletRequest req, HttpServletResponse res) {
        try {
            String authHeader = req.getHeader("Authorization");
            String token = null;
            String email = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                email = jwtService.extractUsername(token);
            }
            if (email != null) {
                User user = userService.getUserByEmail(email);
                UserInfo info = userInfoService.getUserInfoByUser(user);
                List<Booking> allBookings = bookingService.getBookingsByUserInfo(info);
                return new ResponseEntity<>(allBookings, HttpStatus.OK);
            }
            return new ResponseEntity<>(new ErrorComponent("User not found in database."), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    // POST REQUESTS

    @PostMapping("/booking")
    public ResponseEntity<?> postBooking(@RequestBody Booking booking) {
        try {
            List<Booking> allBookings = bookingService.getBookingsByUserInfoAndHospital(booking.getUserInfo(), booking.getHospital());
            long ongoingCount = allBookings.stream().filter(b -> b.getStatus() == Booking.Status.ONGOING).count();
            if (ongoingCount >= 3) {
                return new ResponseEntity<>(new ErrorComponent("User can book only 3 beds from one hospital."), HttpStatus.BAD_REQUEST);
            }
            if(booking.getHospital().getAvailableBeds()==0){
                return new ResponseEntity<>(new ErrorComponent("No bed is available for booking."), HttpStatus.NOT_FOUND);
            }
            bookingService.saveBooking(booking);
            Hospital hospital = booking.getHospital();
            hospital.setAvailableBeds(hospital.getAvailableBeds() - 1);
            hospitalService.addHospitalByHospital(hospital);
            return new ResponseEntity<>("Successfully booked the bed.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/rate")
    public ResponseEntity<?> postRating(@RequestBody Review review) {
        try {
            if (review.getRating() == 0 || review.getDescription() == "") {
                return new ResponseEntity<>(new ErrorComponent("Rating and Desc are compulsory"), HttpStatus.BAD_REQUEST);
            }
            if (review.getHospital() == null || review.getHospital().getName() == "") {
                return new ResponseEntity<>(new ErrorComponent("Hospital not found"), HttpStatus.NOT_FOUND);
            }
            if (review.getUserInfo() == null || review.getUserInfo().getName() == "") {
                return new ResponseEntity<>(new ErrorComponent("User not found"), HttpStatus.NOT_FOUND);
            }
            List<Booking> allBookings = bookingService.getBookingsByUserInfoAndHospital(review.getUserInfo(), review.getHospital());
            if (allBookings.size() == 0) {
                return new ResponseEntity<>(new ErrorComponent("Only users who have booked from this hospital are allowed to review."), HttpStatus.BAD_REQUEST);
            }
            Review userInfoReview = reviewService.getReviewByUserInfoAndHospital(review.getUserInfo(), review.getHospital());
            if (userInfoReview != null) {
                return new ResponseEntity<>(new ErrorComponent("User has already given review for this hospital."), HttpStatus.BAD_REQUEST);
            }
            reviewService.postReview(review);
            Hospital hospital = review.getHospital();
            long allHospitalReviews = reviewService.getReviewByHospital(hospital).stream().count();
            hospital.setTotalRating(((double) (hospital.getTotalRating() + review.getRating()) / allHospitalReviews));
            hospitalService.updateHospitalByHospital(hospital);
            return new ResponseEntity<>(review.getHospital(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // PUT REQUESTS

    @PutMapping("/details")
    public ResponseEntity<?> updateUserDetails(@RequestBody UserInfo userInfo) {
        try {
            if (userInfo.getName() == "" || userInfo.getUser().getEmail() == "") {
                return new ResponseEntity<>(new ErrorComponent("Email and name should not be empty"), HttpStatus.BAD_REQUEST);
            }
            if (String.valueOf(userInfo.getPhone()).length() != 10) {
                return new ResponseEntity<>(new ErrorComponent("Phone number should be 10 digits"), HttpStatus.BAD_REQUEST);
            }
            userService.updateUserByUser(userInfo.getUser());
            userInfoService.updateUserInfoByUserInfo(userInfo);
            return new ResponseEntity<>("Successfully updated the details", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/details/password")
    public ResponseEntity<?> updatePassword(@RequestBody User user) {
        try {
            if (user.getPassword() == "") {
                return new ResponseEntity<>(new ErrorComponent("Password cannot be empty"), HttpStatus.BAD_REQUEST);
            }
            userService.updateUserPasswordByUser(user);
            return new ResponseEntity<>("Successfully changed the password", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE REQUESTS

}
