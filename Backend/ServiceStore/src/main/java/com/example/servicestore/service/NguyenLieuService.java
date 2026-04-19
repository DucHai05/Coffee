package com.example.servicestore.service;

import com.example.servicestore.entity.NguyenLieu;
import com.example.servicestore.repository.NguyenLieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NguyenLieuService {
    
    private final NguyenLieuRepository repository;

    // Lấy tất cả
    public List<NguyenLieu> getAllNguyenLieu() {
        return repository.findAll();
    }

    // Thêm mới hoặc Cập nhật
    public NguyenLieu saveNguyenLieu(NguyenLieu nguyenLieu) {
        return repository.save(nguyenLieu);
    }

    // Xóa
    public void deleteNguyenLieu(String maNguyenLieu) {
        repository.deleteById(maNguyenLieu);
    }
}