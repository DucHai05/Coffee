package com.example.servicestore.service;

import com.example.servicestore.dto.TruKhoRequest;
import com.example.servicestore.entity.NguyenLieu;
import com.example.servicestore.repository.NguyenLieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        System.out.println(">>> [STORE][SAVE] Payload: maNguyenLieu=" + nguyenLieu.getMaNguyenLieu()
                + ", tenNguyenLieu=" + nguyenLieu.getTenNguyenLieu()
                + ", soLuong=" + nguyenLieu.getSoLuong()
                + ", donViTinh=" + nguyenLieu.getDonViTinh()
                + ", soLuongToiThieu=" + nguyenLieu.getSoLuongToiThieu());

        repository.findById(nguyenLieu.getMaNguyenLieu()).ifPresent(current ->
                System.out.println(">>> [STORE][SAVE] Before DB: maNguyenLieu=" + current.getMaNguyenLieu()
                        + ", soLuong=" + current.getSoLuong()
                        + ", soLuongToiThieu=" + current.getSoLuongToiThieu()));

        NguyenLieu saved = repository.save(nguyenLieu);
        repository.flush();

        NguyenLieu reloaded = repository.findById(saved.getMaNguyenLieu()).orElse(saved);
        System.out.println(">>> [STORE][SAVE] After DB: maNguyenLieu=" + reloaded.getMaNguyenLieu()
                + ", soLuong=" + reloaded.getSoLuong()
                + ", soLuongToiThieu=" + reloaded.getSoLuongToiThieu());

        return reloaded;
    }
    @Transactional
    public void updateSoLuongToiThieu(String maNguyenLieu, Double soLuongToiThieu) {
        NguyenLieu nl = repository.findById(maNguyenLieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu mã: " + maNguyenLieu));
        
        if (soLuongToiThieu < 0) {
            throw new RuntimeException("Ngưỡng báo động không thể âm");
        }
        
        nl.setSoLuongToiThieu(soLuongToiThieu);
        repository.save(nl);
    }

    // Xóa
    public void deleteNguyenLieu(String maNguyenLieu) {
        repository.deleteById(maNguyenLieu);
    }

    // Chức năng trừ kho khi bán hàng
    @Transactional
    public void truKho(List<TruKhoRequest> requests) {
        for (TruKhoRequest req : requests) {
            // Tìm nguyên liệu trong kho
            NguyenLieu nl = repository.findById(req.getMaNguyenLieu())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu mã: " + req.getMaNguyenLieu()));

            // Kiểm tra số lượng tồn kho
            if (nl.getSoLuong() < req.getSoLuongTru()) {
                throw new RuntimeException("Kho không đủ số lượng cho nguyên liệu: " + nl.getTenNguyenLieu() + 
                                           " (Tồn: " + nl.getSoLuong() + ", Cần trừ: " + req.getSoLuongTru() + ")");
            }

            // Trừ số lượng và lưu lại
            nl.setSoLuong(nl.getSoLuong() - req.getSoLuongTru());
            repository.save(nl);
        }
    }
}
