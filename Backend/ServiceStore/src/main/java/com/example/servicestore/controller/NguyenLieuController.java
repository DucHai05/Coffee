package com.example.servicestore.controller;

import com.example.servicestore.entity.NguyenLieu;
import com.example.servicestore.repository.NguyenLieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nguyen-lieu")
@RequiredArgsConstructor
public class   NguyenLieuController {
    private final NguyenLieuRepository nguyenLieuRepository;

    @GetMapping
    public ResponseEntity<List<NguyenLieu>> getAll() {
        return ResponseEntity.ok(nguyenLieuRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<NguyenLieu> save(@RequestBody NguyenLieu nguyenLieu) {
        return ResponseEntity.ok(nguyenLieuRepository.save(nguyenLieu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        nguyenLieuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}