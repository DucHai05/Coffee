package com.example.servicecafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ServiceCafeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceCafeApplication.class, args);
    }

}
