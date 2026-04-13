package com.example.servicecafe.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

// url: là địa chỉ máy của Khánh, ví dụ Khánh chạy port 8082
@FeignClient(name = "table-service", url = "http://localhost:8082")
public interface TableServiceClient {

    // Hải "copy" đúng cái API mà Khánh viết bên Service của cậu ấy vào đây
    @PutMapping("/api/tables/{maBan}/status")
    void updateTableStatus(@PathVariable("maBan") String maBan, @RequestParam("status") String status);
}