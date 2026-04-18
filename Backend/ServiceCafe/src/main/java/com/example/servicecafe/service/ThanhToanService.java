package com.example.servicecafe.service;

import com.example.servicecafe.dto.PaymentDTO;
import com.example.servicecafe.entity.*;
import com.example.servicecafe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Đảm bảo đã import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThanhToanService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private ChiTietHDRepository chiTietRepository;

    // 1. PHẢI CÓ DÒNG NÀY thì messagingTemplate mới chạy được
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @Modifying
    @Transactional
    public void xuLyThanhToan(PaymentDTO dto) {
        try {
            String inputMaHD = dto.getMaHoaDon();
            System.out.println(">>> [DEBUG] Bắt đầu xử lý HD: " + inputMaHD);

            HoaDon hd = null;

            // 1. CHẶN LỖI: Chỉ tìm kiếm nếu ID không phải null/rỗng
            if (inputMaHD != null && !inputMaHD.trim().isEmpty() && !"undefined".equals(inputMaHD)) {
                hd = hoaDonRepository.findById(inputMaHD).orElse(null);
            }

            // 2. Nếu không tìm thấy hoặc ID truyền vào là null -> Tạo mới
            if (hd == null) {
                System.out.println(">>> [INFO] Đang tạo hóa đơn mới hoàn toàn...");
                hd = new HoaDon();
                // Tự sinh mã nếu chưa có
                String finalMaHD = (inputMaHD != null && !inputMaHD.trim().isEmpty() && !"undefined".equals(inputMaHD))
                        ? inputMaHD
                        : "HD" + System.currentTimeMillis();
                hd.setMaHoaDon(finalMaHD);
                hd.setThoiGianVao(LocalDateTime.now().minusMinutes(30));
            }

            // 3. Cập nhật các thông tin còn lại
            hd.setMaBan(dto.getMaBan());
            hd.setMaCa(dto.getMaCa());
            hd.setPhuongThucThanhToan(dto.getPhuongThucThanhToan());
            hd.setMaKhuyenMai(dto.getMaKhuyenMai());
            hd.setTongTien(dto.getTongTienSauKM());
            hd.setTrangThaiThanhToan("Paid");
            hd.setThoiGianRa(LocalDateTime.now());

            // 4. Lưu Header
            HoaDon savedHd = hoaDonRepository.save(hd);

            // 5. Lưu Chi tiết (Phần này ông đã sửa ok rồi, nhớ gán mã chi tiết nhé)
            if (dto.getItems() != null && !dto.getItems().isEmpty()) {
                chiTietRepository.deleteByMaHoaDon(savedHd);
                chiTietRepository.flush();

                int index = 1;
                List<ChiTietHD> chiTiets = new ArrayList<>();
                for (var itemDto : dto.getItems()) {
                    ChiTietHD ct = new ChiTietHD();
                    ct.setMaChiTietHD(savedHd.getMaHoaDon() + "CTHD" + (index++));
                    ct.setMaHoaDon(savedHd);
                    ct.setMaSanPham(itemDto.getMaSanPham());
                    ct.setSoLuong(itemDto.getSoLuong());
                    ct.setDonGia(itemDto.getGiaBan());
                    ct.setGhiChu(itemDto.getGhiChu());
                    chiTiets.add(ct);
                }
                chiTietRepository.saveAll(chiTiets);
            }

            messagingTemplate.convertAndSend("/topic/tables", dto.getMaBan());
            System.out.println(">>> [SUCCESS] Đã thanh toán xong bàn: " + dto.getMaBan());

        } catch (Exception e) {
            System.err.println("❌ LỖI THANH TOÁN: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}