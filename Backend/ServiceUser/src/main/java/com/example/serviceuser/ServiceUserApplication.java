package com.example.serviceuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ServiceUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceUserApplication.class, args);

        // PHẢI NẰM TRONG CẶP NGOẶC CỦA HÀM MAIN NÀY
        String encoded = new BCryptPasswordEncoder().encode("123456");
        System.out.println("=================================================");
        System.out.println("MA BAM CHUAN CUA 123456 LA: " + encoded);
        System.out.println("=================================================");


    }
}