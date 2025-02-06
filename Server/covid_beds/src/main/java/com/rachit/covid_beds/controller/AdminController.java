package com.rachit.covid_beds.controller;

import com.rachit.covid_beds.config.MyUserDetailsService;
import com.rachit.covid_beds.error.ErrorComponent;
import com.rachit.covid_beds.jwt.JwtService;
import com.rachit.covid_beds.model.Booking;
import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.model.User;
import com.rachit.covid_beds.service.BookingService;
import com.rachit.covid_beds.service.HospitalService;
import com.rachit.covid_beds.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private HospitalService hospitalService;
    @Autowired
    private UserService userService;
    @Autowired
    private BookingService bookingService;

    // GET REQUESTS

    @GetMapping({"", "/"})
    public ResponseEntity<?> getAdmin(HttpServletRequest req, HttpServletResponse res) {
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
        return new ResponseEntity<>(new ErrorComponent("No user with given email found."), HttpStatus.NOT_FOUND);
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
        try {
            Hospital hospital = hospitalService.findHospitalById(id);
            if (hospital.getName() == "") {
                return new ResponseEntity<>(new ErrorComponent("Hospital not found"), HttpStatus.NOT_FOUND);
            }
            List<Booking> allBookings = bookingService.getBookingsByHospital(hospital);
            return new ResponseEntity<>(allBookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // POST REQUESTS

    @PostMapping("/addHospital")
    public ResponseEntity<?> addHospital(@RequestBody Hospital hospital) {
        Hospital currentHospital = hospitalService.findByLongitudeAndLatitude(hospital);
        if (currentHospital != null) {
            return new ResponseEntity<>(new ErrorComponent("Hospital entered already present in database"), HttpStatus.NOT_ACCEPTABLE);
        }
        if (hospital.getAvailableBeds() < 0) {
            return new ResponseEntity<>(new ErrorComponent("Available beds should be greater than 0"), HttpStatus.BAD_REQUEST);
        }
        if (String.valueOf(hospital.getPhone()).length() != 10) {
            return new ResponseEntity<>(new ErrorComponent("Phone number should be of 10 digits"), HttpStatus.BAD_REQUEST);
        }
        if (hospital.getBedCost() < 0) {
            return new ResponseEntity<>(new ErrorComponent("Bed Cost should be >= 0"), HttpStatus.BAD_REQUEST);
        }
        if (hospital.getName() == "" || hospital.getAddress() == "") {
            return new ResponseEntity<>(new ErrorComponent("name and address should not be null"), HttpStatus.BAD_REQUEST);
        }
        hospitalService.addHospitalByHospital(hospital);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // PUT REQUESTS
    @PutMapping("/hospital/{id}")
    public ResponseEntity<?> updateHospital(@PathVariable("id") int id, @RequestBody Hospital hospital) {
        try {
            if (hospital.getAvailableBeds() < 0) {
                return new ResponseEntity<>(new ErrorComponent("Available beds should be greater than 0"), HttpStatus.BAD_REQUEST);
            }
            if (String.valueOf(hospital.getPhone()).length() != 10) {
                return new ResponseEntity<>(new ErrorComponent("Phone number should be of 10 digits"), HttpStatus.BAD_REQUEST);
            }
            if (hospital.getBedCost() < 0) {
                return new ResponseEntity<>(new ErrorComponent("Bed Cost should be >= 0"), HttpStatus.BAD_REQUEST);
            }
            if (hospital.getName() == "" || hospital.getAddress() == "") {
                return new ResponseEntity<>(new ErrorComponent("name and address should not be null"), HttpStatus.BAD_REQUEST);
            }
            hospitalService.updateHospitalByHospitalAndId(hospital, id);
            return new ResponseEntity<>("Successfully updated the details", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorComponent(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/hospital/booking")
    public ResponseEntity<?> updateBooking(@RequestBody Booking booking){
        bookingService.updateBooking(booking);
        List<Booking> allBookings=bookingService.getBookingsByUserInfoAndHospital(booking.getUserInfo(), booking.getHospital());
        return new ResponseEntity<>(allBookings, HttpStatus.OK);
    }

    // DELETE REQUESTS

}
