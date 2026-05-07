package com.example.servicepromotion.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "KhuyenMaiConfig")
public class KhuyenMaiConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maKMConfig")
    private Long idConfig;

    @ManyToOne
    @JoinColumn(name = "maKhuyenMai")
    @JsonBackReference
    private KhuyenMai khuyenMai;

    @Column(name = "loaiDoiTuong")
    private String loaiDoiTuong; // STAFF, VIP...

    @Column(name = "giaTriDonToiThieu")
    private double giaTriDonToiThieu;

    @Column(name = "apDungChoLoaiSP")
    private String apDungChoMon; // ALL, CAFE, TEA...

    public Long getIdConfig() {
        return idConfig;
    }

    public void setIdConfig(Long idConfig) {
        this.idConfig = idConfig;
    }

    public KhuyenMai getKhuyenMai() {
        return khuyenMai;
    }

    public void setKhuyenMai(KhuyenMai khuyenMai) {
        this.khuyenMai = khuyenMai;
    }

    public String getLoaiDoiTuong() {
        return loaiDoiTuong;
    }

    public void setLoaiDoiTuong(String loaiDoiTuong) {
        this.loaiDoiTuong = loaiDoiTuong;
    }

    public double getGiaTriDonToiThieu() {
        return giaTriDonToiThieu;
    }

    public void setGiaTriDonToiThieu(double giaTriDonToiThieu) {
        this.giaTriDonToiThieu = giaTriDonToiThieu;
    }

    public String getApDungChoMon() {
        return apDungChoMon;
    }

    public void setApDungChoMon(String apDungChoMon) {
        this.apDungChoMon = apDungChoMon;
    }
}
