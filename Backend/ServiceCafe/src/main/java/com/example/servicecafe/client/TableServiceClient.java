package com.example.servicecafe.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

// Gọi service-table qua Eureka
@FeignClient(name = "service-table")
public interface TableServiceClient {

    // Hải "copy" đúng cái API mà Khánh viết bên Service của cậu ấy vào đây
    @PutMapping("/api/tables/{maBan}/status")
    void updateTableStatus(@PathVariable("maBan") String maBan, @RequestParam("status") String status);
}