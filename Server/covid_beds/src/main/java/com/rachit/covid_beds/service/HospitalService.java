package com.rachit.covid_beds.service;

import com.rachit.covid_beds.model.Booking;
import com.rachit.covid_beds.model.Hospital;
import com.rachit.covid_beds.repo.HospitalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {
    @Autowired
    private HospitalRepo hospitalRepo;

    public void addHospitalByHospital(Hospital hospital) {
        hospitalRepo.save(hospital);
    }

    public Hospital findByLongitudeAndLatitude(Hospital hospital) {
        return hospitalRepo.findByLongitudeAndLatitude(hospital.getLongitude(), hospital.getLatitude());
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepo.findAll();
    }

    public Hospital findHospitalById(int id) {
        return hospitalRepo.findById(id).orElse(new Hospital());
    }

    public void updateHospitalByHospitalAndId(Hospital hospital, int id) {
        Hospital h = hospitalRepo.findById(id).orElse(new Hospital());
        if (h.getName() != null) {
            h.setName(hospital.getName());
            h.setAddress(hospital.getAddress());
            h.setAvailableBeds(hospital.getAvailableBeds());
            h.setBedCost(hospital.getBedCost());
            h.setPhone(hospital.getPhone());
            h.setLongitude(hospital.getLongitude());
            h.setLatitude(hospital.getLatitude());
            hospitalRepo.save(h);
        }
    }

    public void updateHospitalByHospital(Hospital hospital){
        hospitalRepo.save(hospital);
    }

}
