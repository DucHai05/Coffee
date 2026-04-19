package com.example.servicecafe.controller;

import com.example.servicecafe.entity.ChiTietHD;
<<<<<<< HEAD
=======
import com.example.servicecafe.entity.HoaDon;
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
import com.example.servicecafe.service.ChiTietHDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chitiethd")
@CrossOrigin(origins = "*")
public class ChiTietHDController {
    @Autowired
    private ChiTietHDService service;

    @GetMapping
    public List<ChiTietHD> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maChiTietHD}")
    public ChiTietHD getById(@PathVariable String maChiTietHD) {
        return service.getById(maChiTietHD);
    }

    @GetMapping("/hoadon/{maHoaDon}")
<<<<<<< HEAD
    public List<ChiTietHD> getByMaHoaDon(@PathVariable String maHoaDon) {
=======
    public List<ChiTietHD> getByMaHoaDon(@PathVariable HoaDon maHoaDon) {
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
        return service.getByMaHoaDon(maHoaDon);
    }
}
