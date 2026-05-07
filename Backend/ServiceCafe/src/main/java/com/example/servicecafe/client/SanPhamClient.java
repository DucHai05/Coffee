package com.example.servicecafe.client;

import com.example.servicecafe.dto.SanPhamResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@FeignClient(name = "service-product", url = "${service-product.url:http://localhost:8087}")
public interface SanPhamClient {
    @GetMapping("/v1/san-pham/{id}")
    SanPhamResponseDTO getSanPhamById(@PathVariable("id") String id);
    // Thêm method này vào interface SanPhamClient
}

