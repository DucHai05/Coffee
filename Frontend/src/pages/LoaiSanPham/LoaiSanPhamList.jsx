import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import Component Modal Form vừa tạo ở trên
import LoaiSanPhamForm from '../../components/LoaiSanPham/LoaiSanPhamForm';
import './loaiSanPham.css';

export default function LoaiSanPhamList() {
    const [danhSachLoai, setDanhSachLoai] = useState([]);
    
    // State quản lý việc hiển thị Modal
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    
    useEffect(() => { 
        fetchData(); 
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8087/api/v1/loai-san-pham');
            setDanhSachLoai(res.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    const handleOpenModal = (loai = null) => {
        if (loai) {
            setIsEdit(true);
            setEditData(loai); // Lưu data của dòng được chọn để ném vào form
        } else {
            setIsEdit(false);
            setEditData(null); // Truyền null để form tự sinh mã mới
        }
        setShowModal(true);
    };

    const handleDelete = async (id, ten) => {
        if (window.confirm(`CẢNH BÁO: Xóa loại "${ten}" sẽ xóa TẤT CẢ sản phẩm thuộc loại này. Bạn có chắc chắn?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/loai-san-pham/${id}`);
                fetchData();
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa do lỗi kết nối hoặc dữ liệu đang được sử dụng!");
            }
        }
    };

    return (
    <div className="loaisp-container">
        {/* Header với nút Thêm mới phong cách Lado */}
        <div className="loaisp-header">
            <h2 className="loaisp-title">QUẢN LÝ LOẠI SẢN PHẨM</h2>
            <button className="btn-add-new" onClick={() => handleOpenModal()}>
                + Thêm Loại Mới
            </button>
        </div>
        
        {/* Card chứa bảng dữ liệu */}
        <div className="loaisp-card">
            <table className="loaisp-table">
                <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Mã Loại</th>
                        <th style={{ width: '50%' }}>Tên Loại Sản Phẩm</th>
                        <th style={{ width: '25%' }}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSachLoai.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ padding: '60px', color: '#94a3b8' }}>
                                Chưa có loại sản phẩm nào trong hệ thống.
                            </td>
                        </tr>
                    ) : (
                        danhSachLoai.map(loai => (
                            <tr key={loai.maLoaiSanPham}>
                                <td className="ma-loai">{loai.maLoaiSanPham}</td>
                                <td className="ten-loai" style={{ textAlign: 'left', paddingLeft: '15%' }}>
                                    {loai.tenLoaiSanPham}
                                </td>
                                <td>
                                    <div className="action-group">
                                        <button className="btn-loaisp btn-loaisp-edit" onClick={() => handleOpenModal(loai)}>
                                            SỬA
                                        </button>
                                        <button className="btn-loaisp btn-loaisp-delete" onClick={() => handleDelete(loai.maLoaiSanPham, loai.tenLoaiSanPham)}>
                                            XÓA
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {/* Modal Form */}
        {showModal && (
            <LoaiSanPhamForm 
                isEdit={isEdit}
                initialData={editData}
                onClose={() => setShowModal(false)}
                onRefresh={fetchData}
            />
        )}
    </div>
);
}