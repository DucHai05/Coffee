package com.example.serviceproduct.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO dùng để expose API - có thể share giữa các service
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamDTO {
    private String maSanPham;
    private String tenSanPham;
    private Double donGia;
    private String duongDanHinh;
    private String trangThai;
    private String maLoaiSanPham;
    private String tenLoaiSanPham;
    private List<CongThucDTO> danhSachCongThuc;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CongThucDTO {
        private String maNguyenLieu;
        private Double soLuong;
    }
}
