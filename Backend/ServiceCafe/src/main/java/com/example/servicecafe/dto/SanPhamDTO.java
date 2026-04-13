package com.example.servicecafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamDTO {
    private String maSanPham;
    private String tenSanPham;
    private Double giaBan;
}
