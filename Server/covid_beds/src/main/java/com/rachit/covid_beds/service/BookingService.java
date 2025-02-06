package com.rachit.covid_beds.service;


import com.rachit.covid_beds.model.Booking;
import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.model.UserInfo;
import com.rachit.covid_beds.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    public void saveBooking(Booking booking) {
        bookingRepo.save(booking);
    }

    public Booking getBookingByBookedDate(String bookedDate) {
        return bookingRepo.findByBookedDate(bookedDate);
    }

    public List<Booking> getBookingsByHospital(Hospital hospital) {
        return bookingRepo.findAllByHospital(hospital);
    }

    public List<Booking> getBookingsByUserInfo(UserInfo info) {
        return bookingRepo.findAllByUserInfo(info);
    }

    public List<Booking> getBookingsByUserInfoAndHospital(UserInfo userInfo, Hospital hospital) {
        return bookingRepo.findAllByUserInfoAndHospital(userInfo, hospital);
    }

    public void updateBooking(Booking booking){
        bookingRepo.save(booking);
    }
}
