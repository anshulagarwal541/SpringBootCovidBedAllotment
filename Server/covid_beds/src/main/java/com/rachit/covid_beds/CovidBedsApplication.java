package com.rachit.covid_beds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CovidBedsApplication {

    public static void main(String[] args) {
        try {
            SpringApplication.run(CovidBedsApplication.class, args);
            System.out.println("************************");
            System.out.println("Successfully connected to port 8080.");
            System.out.println("************************");
        } catch (Exception e) {
            System.out.println("********************");
            System.out.println(e);
            System.out.println("********************");
        }
    }

}
