import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import './sanPhamForm.css';

const SanPhamForm = ({ isEditing, initialData, initialCongThuc, khoNguyenLieu, loaiSanPhams, onClose, onRefresh }) => {
    const [formData, setFormData] = useState(initialData || {
        maSanPham: 'SP' + Date.now(), 
        tenSanPham: '', 
        donGia: '', 
        maLoaiSanPham: 'LSP01', 
        trangThai: 'Đang bán', 
        duongDanHinh: ''
    });

    const [congThuc, setCongThuc] = useState(initialCongThuc || []); 
    const [nlTempt, setNlTempt] = useState({ 
        maNguyenLieu: khoNguyenLieu.length > 0 ? khoNguyenLieu[0].maNguyenLieu : '', 
        soLuong: 1 
    });

    // HÀM UPLOAD ẢNH
    const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
        const response = await api.post('/upload', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Đảm bảo URL ảnh có đầy đủ http://localhost:8087
        const imageUrl = response.data.startsWith('http') 
            ? response.data 
            : `http://localhost:8087${response.data}`;
            
        setFormData(prev => ({ ...prev, duongDanHinh: imageUrl }));
    } catch (error) {
        console.error("Lỗi upload:", error);
        alert("Lỗi khi tải ảnh lên máy chủ (Cổng 8087)!");
    }
};

    // THÊM NGUYÊN LIỆU VÀO CÔNG THỨC
    const themNguyenLieuVaoCongThuc = () => {
        if (!nlTempt.maNguyenLieu || nlTempt.soLuong <= 0) return alert("Vui lòng chọn NL và nhập số lượng > 0");
        const isExist = congThuc.find(ct => ct.maNguyenLieu === nlTempt.maNguyenLieu);
        if (isExist) return alert("Nguyên liệu này đã có trong công thức!");

        const nlInfo = khoNguyenLieu.find(nl => nl.maNguyenLieu === nlTempt.maNguyenLieu);
        setCongThuc([...congThuc, {
            maNguyenLieu: nlInfo.maNguyenLieu,
            tenNguyenLieu: nlInfo.tenNguyenLieu,
            soLuong: nlTempt.soLuong,
            donViTinh: nlInfo.donViTinh
        }]);
    };

    // XÓA NGUYÊN LIỆU KHỎI CÔNG THỨC
    const xoaNguyenLieuKhoiCongThuc = (maNguyenLieu) => {
        setCongThuc(congThuc.filter(c => c.maNguyenLieu !== maNguyenLieu));
    };

    // LƯU THÔNG TIN SẢN PHẨM
    const handleLuuThongTin = async () => {
        if(!formData.maSanPham || !formData.tenSanPham) return alert("Vui lòng nhập Mã và Tên sản phẩm!");

        const payload = {
            maSanPham: formData.maSanPham,
            tenSanPham: formData.tenSanPham,
            donGia: formData.donGia,
            trangThai: formData.trangThai,
            duongDanHinh: formData.duongDanHinh, 
            loaiSanPham: { maLoaiSanPham: formData.maLoaiSanPham },
            danhSachCongThuc: congThuc.map(ct => ({
                id: { maSanPham: formData.maSanPham, maNguyenLieu: ct.maNguyenLieu },
                nguyenLieu: { maNguyenLieu: ct.maNguyenLieu },
                soLuong: ct.soLuong
            }))
        };

        try {
            await api.post('/san-pham', payload);
            alert("Lưu dữ liệu thành công!");
            onRefresh(); // Load lại dữ liệu ở component cha
            onClose();   // Tắt form
        } catch (error) {
            console.error(error);
            alert("Có lỗi khi lưu sản phẩm!");
        }
    };

   return (
    <div className="sp-form-wrapper">
        <div className="sp-form-header">
            <h2>{isEditing ? `Sửa Sản Phẩm: ${formData.tenSanPham}` : 'Thêm Sản Phẩm Mới'}</h2>
            <button className="btn-lado btn-lado-back" onClick={onClose}>← Quay lại</button>
        </div>

        <div className="row g-4">
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
            <div className="col-md-5">
                <div className="sp-card">
                    <div className="sp-card-header info">Hình ảnh & Thông tin chính</div>
                    <div className="sp-card-body">
                        <div className="form-group-lado">
                            <label>Ảnh đại diện sản phẩm</label>
                            <div className="upload-zone">
                                <input type="file" className="form-control mb-2" accept="image/*" onChange={handleImageUpload} />
                                <div className="preview-img-container">
                                    {formData.duongDanHinh ? (
                                        <img src={formData.duongDanHinh} alt="Preview" />
                                    ) : (
                                        <span className="text-muted">Chưa có ảnh</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div className="form-group-lado">
                                    <label>Mã Sản Phẩm</label>
                                    <input type="text" className="input-lado" disabled value={formData.maSanPham} />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group-lado">
                                    <label>Loại sản phẩm</label>
                                    <select className="input-lado" value={formData.maLoaiSanPham} onChange={e => setFormData({...formData, maLoaiSanPham: e.target.value})}>
                                        {loaiSanPhams.map(loai => (
                                            <option key={loai.maLoaiSanPham} value={loai.maLoaiSanPham}>{loai.tenLoaiSanPham}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group-lado">
                            <label>Tên sản phẩm</label>
                            <input type="text" className="input-lado" placeholder="Ví dụ: Cà phê Muối" value={formData.tenSanPham} onChange={e => setFormData({...formData, tenSanPham: e.target.value})} />
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div className="form-group-lado">
                                    <label>Đơn giá (VNĐ)</label>
                                    <input type="number" className="input-lado" value={formData.donGia} onChange={e => setFormData({...formData, donGia: e.target.value})} />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group-lado">
                                    <label>Trạng thái</label>
                                    <select className="input-lado" value={formData.trangThai} onChange={e => setFormData({...formData, trangThai: e.target.value})}>
                                        <option value="Đang bán">Đang bán</option>
                                        <option value="Ngừng bán">Ngừng bán</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: CÔNG THỨC PHA CHẾ */}
            <div className="col-md-7">
                <div className="sp-card">
                    <div className="sp-card-header recipe">Xây dựng công thức (Định mức kho)</div>
                    <div className="sp-card-body">
                        <div className="recipe-builder">
                            <div style={{ flex: 2 }}>
                                <label className="text-muted small fw-bold">Chọn Nguyên Liệu</label>
                                <select className="input-lado" value={nlTempt.maNguyenLieu} onChange={e => setNlTempt({...nlTempt, maNguyenLieu: e.target.value})}>
                                    {khoNguyenLieu.map(nl => (
                                        <option key={nl.maNguyenLieu} value={nl.maNguyenLieu}>{nl.tenNguyenLieu} ({nl.donViTinh})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="text-muted small fw-bold">Số lượng</label>
                                <input type="number" className="input-lado" min="0.1" step="0.1" value={nlTempt.soLuong} onChange={e => setNlTempt({...nlTempt, soLuong: e.target.value})} />
                            </div>
                            <button className="btn-lado btn-lado-add" onClick={themNguyenLieuVaoCongThuc}>+ THÊM</button>
                        </div>

                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            <table className="recipe-table">
                                <thead>
                                    <tr>
                                        <th>Nguyên liệu</th>
                                        <th>Lượng cần</th>
                                        <th>Đơn vị</th>
                                        <th style={{ textAlign: 'center' }}>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {congThuc.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center p-4 text-muted">Chưa có nguyên liệu nào trong công thức này.</td></tr>
                                    ) : (
                                        congThuc.map(ct => (
                                            <tr key={ct.maNguyenLieu}>
                                                <td className="fw-bold">{ct.tenNguyenLieu}</td>
                                                <td className="text-danger fw-bold">{ct.soLuong}</td>
                                                <td>{ct.donViTinh}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="btn-remove-item" onClick={() => xoaNguyenLieuKhoiCongThuc(ct.maNguyenLieu)}>×</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <button className="btn-lado btn-lado-save" onClick={handleLuuThongTin}>
                            💾 LƯU SẢN PHẨM & CÔNG THỨC
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default SanPhamForm;