package com.example.serviceproduct.controller;

import com.example.serviceproduct.dto.response.SanPhamDTO;
import com.example.serviceproduct.dto.response.SanPhamResponse;
import com.example.serviceproduct.entity.CongThuc;
import com.example.serviceproduct.entity.SanPham;
import com.example.serviceproduct.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/san-pham")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173") // Cho phép Frontend (React/Vue/Swing call API)
public class SanPhamController {

    private final SanPhamService sanPhamService;

    // GET: /api/v1/san-pham
    @GetMapping
    public ResponseEntity<List<SanPhamResponse>> getAll() {
        return ResponseEntity.ok(sanPhamService.getAllSanPham());
    }

    @GetMapping("/{id}")
    public SanPhamDTO getById(@PathVariable String id) {
        SanPhamResponse response = sanPhamService.getSanPhamById(id);
        return convertToDTO(response);
    }

    // POST: /api/v1/san-pham
    @PostMapping
    public ResponseEntity<SanPham> create(@RequestBody SanPham sanPham) {
        return ResponseEntity.ok(sanPhamService.saveSanPham(sanPham));
    }

    // DELETE: /api/v1/san-pham/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        sanPhamService.deleteSanPham(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method để convert SanPhamResponse → SanPhamDTO
    private SanPhamDTO convertToDTO(SanPhamResponse response) {
        SanPhamDTO dto = new SanPhamDTO();
        dto.setMaSanPham(response.getMaSanPham());
        dto.setTenSanPham(response.getTenSanPham());
        dto.setDonGia(response.getDonGia());
        dto.setDuongDanHinh(response.getDuongDanHinh());
        dto.setTrangThai(response.getTrangThai());
        dto.setMaLoaiSanPham(response.getMaLoaiSanPham());
        dto.setTenLoaiSanPham(response.getTenLoaiSanPham());

        if (response.getDanhSachCongThuc() != null) {
            dto.setDanhSachCongThuc(response.getDanhSachCongThuc().stream()
                    .map(ct -> new SanPhamDTO.CongThucDTO(ct.getMaNguyenLieu(), ct.getSoLuong()))
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}