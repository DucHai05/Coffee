import React, { useState } from 'react';
import { employeeApi, notificationApi } from '../../api/APIGateway';
import './baoKhoForm.css';

const BaoKhoForm = ({ nguyenLieus, onClose }) => {
    const [baoKhoItems, setBaoKhoItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNguyenLieus = nguyenLieus.filter(nl =>
        nl.tenNguyenLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nl.maNguyenLieu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleBaoKhoItem = (nl) => {
        const isSelected = baoKhoItems.some(item => item.maNguyenLieu === nl.maNguyenLieu);
        if (isSelected) {
            setBaoKhoItems(baoKhoItems.filter(item => item.maNguyenLieu !== nl.maNguyenLieu));
        } else {
            setBaoKhoItems([...baoKhoItems, {
                maNguyenLieu: nl.maNguyenLieu,
                tenNguyenLieu: nl.tenNguyenLieu,
                noiDung: `Tồn kho hiện tại: ${nl.soLuong} ${nl.donViTinh}`
            }]);
        }
    };

    const handleSelectAll = () => {
        if (baoKhoItems.length === filteredNguyenLieus.length && filteredNguyenLieus.length > 0) {
            setBaoKhoItems([]);
        } else {
            const allItems = filteredNguyenLieus.map(nl => ({
                maNguyenLieu: nl.maNguyenLieu,
                tenNguyenLieu: nl.tenNguyenLieu,
                noiDung: `Tồn kho hiện tại: ${nl.soLuong} ${nl.donViTinh}`
            }));
            setBaoKhoItems(allItems);
        }
    };

    const handleChangeReason = (maNguyenLieu, newReason) => {
        setBaoKhoItems(baoKhoItems.map(item =>
            item.maNguyenLieu === maNguyenLieu ? { ...item, noiDung: newReason } : item
        ));
    };

    const handleSubmitAllBaoKho = async () => {
        if (baoKhoItems.length === 0) return;

        try {
            const responseUser = await employeeApi.getAll();
            const danhSachQuanLy = responseUser.data
                .map(nv => nv.maNhanVien)
                .filter(ma => ma.startsWith('QL'));

            if (danhSachQuanLy.length === 0) {
                alert("Không tìm thấy Quản lý nào trong hệ thống để gửi báo cáo!");
                return;
            }

            const noiDungGop = baoKhoItems.map((item) => `- ${item.tenNguyenLieu}: ${item.noiDung}`).join('\n');
            const promises = [];

            danhSachQuanLy.forEach(maQL => {
                promises.push(notificationApi.create({
                    maNhanVien: maQL,
                    tieuDe: `Báo cáo kho (${baoKhoItems.length} nguyên liệu)`,
                    noiDung: noiDungGop,
                    loaiThongBao: 'KHO',
                    idThamChieu: null
                }));
            });

            await Promise.all(promises);

            alert(`Đã gửi báo cáo tự động tới ${danhSachQuanLy.length} Quản lý thành công!`);
            setBaoKhoItems([]);
            onClose(); // Đóng form báo kho
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đã xảy ra lỗi kết nối! Hãy chắc chắn API Gateway (8080) và các service đang chạy.");
        }
    };

  return (
    <div className="bk-container">
        <div className="bk-card">
            {/* Header với Badge số lượng */}
            <div className="bk-header">
                <h3>🔔 Tạo Báo Cáo Nguyên Liệu</h3>
                <span className="badge bg-danger">Món đã chọn: {baoKhoItems.length}</span>
            </div>

            <div className="bk-body">
                <div className="row">
                    {/* CỘT TRÁI: DANH SÁCH CHỌN */}
                    <div className="col-md-5 border-end pe-4">
                        <div className="bk-column-title">1. Chọn nguyên liệu cần báo</div>
                        <input 
                            type="text" 
                            className="bk-search-input" 
                            placeholder="🔍 Tìm tên hoặc mã..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        
                        <div className="form-check mb-3 ms-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="selectAll" 
                                checked={baoKhoItems.length === filteredNguyenLieus.length && filteredNguyenLieus.length > 0} 
                                onChange={handleSelectAll} 
                            />
                            <label className="form-check-label fw-bold text-primary" htmlFor="selectAll" style={{ cursor: 'pointer' }}>
                                Chọn tất cả
                            </label>
                        </div>

                        <div className="bk-list-scroll">
                            {filteredNguyenLieus.length === 0 ? (
                                <div className="p-4 text-center text-muted">Không có dữ liệu</div>
                            ) : (
                                filteredNguyenLieus.map(nl => {
                                    const isLow = nl.soLuong <= (nl.nguongCanhBao ?? 10);
                                    const isChecked = baoKhoItems.some(item => item.maNguyenLieu === nl.maNguyenLieu);
                                    return (
                                        <label key={nl.maNguyenLieu} className={`bk-item-label ${isChecked ? 'selected' : ''}`}>
                                            <input 
                                                className="bk-checkbox" 
                                                type="checkbox" 
                                                checked={isChecked} 
                                                onChange={() => handleToggleBaoKhoItem(nl)} 
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div className="fw-bold" style={{ color: 'var(--slate-800)' }}>{nl.tenNguyenLieu}</div>
                                                <small className={isLow ? 'text-danger fw-bold' : 'text-muted'}>
                                                    Tồn: {nl.soLuong} {nl.donViTinh}
                                                </small>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: CHI TIẾT LÝ DO */}
                    <div className="col-md-7 ps-4">
                        <div className="bk-column-title">2. Chi tiết nội dung gửi Quản lý</div>
                        <div className="bk-table-area">
                            {baoKhoItems.length === 0 ? (
                                <div className="bk-empty-state">
                                    <p>Chưa có nguyên liệu nào được chọn.<br/>Vui lòng tick chọn danh sách bên trái.</p>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                    <table className="bk-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40%' }}>Nguyên liệu</th>
                                                <th style={{ width: '60%' }}>Nội dung/Lý do</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {baoKhoItems.map((item) => (
                                                <tr key={item.maNguyenLieu}>
                                                    <td className="fw-bold text-primary">{item.tenNguyenLieu}</td>
                                                    <td>
                                                        <input 
                                                            type="text" 
                                                            className="bk-reason-input" 
                                                            value={item.noiDung} 
                                                            onChange={(e) => handleChangeReason(item.maNguyenLieu, e.target.value)} 
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer với các nút bấm bo góc đồng bộ */}
            <div className="bk-footer">
                <button type="button" className="btn-lado btn-back" onClick={onClose}>Quay lại</button>
                <button 
                    type="button" 
                    className="btn-lado btn-send" 
                    onClick={handleSubmitAllBaoKho} 
                    disabled={baoKhoItems.length === 0}
                >
                    🚀 Gửi Báo Cáo Cho Quản Lý
                </button>
            </div>
        </div>
    </div>
);
};
export default BaoKhoForm;