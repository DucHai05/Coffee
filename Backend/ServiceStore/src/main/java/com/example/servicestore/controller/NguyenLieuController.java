package com.example.servicestore.controller;

import com.example.servicestore.dto.TruKhoRequest;
import com.example.servicestore.entity.NguyenLieu;
import com.example.servicestore.repository.NguyenLieuRepository;
import com.example.servicestore.service.NguyenLieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nguyen-lieu")
@RequiredArgsConstructor
public class   NguyenLieuController {
    private final NguyenLieuRepository nguyenLieuRepository;
    private final NguyenLieuService nguyenLieuService;

    @GetMapping
    public ResponseEntity<List<NguyenLieu>> getAll() {
        return ResponseEntity.ok(nguyenLieuRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<NguyenLieu> save(@RequestBody NguyenLieu nguyenLieu) {
        System.out.println(">>> [STORE][CONTROLLER][POST /nguyen-lieu] Received: " + nguyenLieu);
        return ResponseEntity.ok(nguyenLieuService.saveNguyenLieu(nguyenLieu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NguyenLieu> update(@PathVariable String id, @RequestBody NguyenLieu nguyenLieu) {
        System.out.println(">>> [STORE][CONTROLLER][PUT /nguyen-lieu/" + id + "] Received: " + nguyenLieu);
        nguyenLieu.setMaNguyenLieu(id);
        return ResponseEntity.ok(nguyenLieuService.saveNguyenLieu(nguyenLieu));
    }

    @PostMapping(value = "/tru-kho", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Void> truKho(@RequestBody List<TruKhoRequest> requests) {
        nguyenLieuService.truKho(requests);
        return ResponseEntity.noContent().build();
    }
     @PutMapping("/{id}/so-luong-toi-thieu")
    public ResponseEntity<?> updateSoLuongToiThieu(@PathVariable String id, @RequestParam Double soLuongToiThieu) {
        try {
            nguyenLieuService.updateSoLuongToiThieu(id, soLuongToiThieu);
            return ResponseEntity.ok("Đã cập nhật ngưỡng báo động thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        nguyenLieuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
