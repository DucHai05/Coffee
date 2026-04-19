package com.example.servicecafe.repository;

import com.example.servicecafe.entity.ChiTietHD;
import com.example.servicecafe.entity.HoaDon;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
<<<<<<< HEAD
import org.springframework.data.repository.query.Param;
=======
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7

import java.util.List;

public interface ChiTietHDRepository extends JpaRepository<ChiTietHD, String> {

    List<ChiTietHD> findByMaHoaDon(HoaDon maHoaDon);
<<<<<<< HEAD

    @Query("SELECT c FROM ChiTietHD c WHERE c.maHoaDon.maHoaDon = :maHoaDon")
    List<ChiTietHD> findAllByMaHoaDon(@Param("maHoaDon") String maHoaDon);
=======
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
    @Modifying // PHẢI CÓ: Để báo đây là lệnh thay đổi dữ liệu
    @Transactional // PHẢI CÓ: Để thực thi việc xóa trong DB
    @Query("DELETE FROM ChiTietHD c WHERE c.maHoaDon = :hd")
    void deleteByMaHoaDon(HoaDon hd);
}
