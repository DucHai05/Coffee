import React, { useState } from 'react';
import { khoApi } from '../../api/APIGateway';
import './nguyenLieuForm.css';

const createDefaultFormData = () => ({
    maNguyenLieu: 'NL' + Date.now(),
    tenNguyenLieu: '',
    soLuong: 0,
    donViTinh: 'Gam',
    soLuongToiThieu: 0
});

const normalizeFormData = (data) => {
    const defaults = createDefaultFormData();
    const source = data || {};

    return {
        maNguyenLieu: source.maNguyenLieu ?? defaults.maNguyenLieu,
        tenNguyenLieu: source.tenNguyenLieu ?? defaults.tenNguyenLieu,
        soLuong: source.soLuong ?? defaults.soLuong,
        donViTinh: source.donViTinh ?? defaults.donViTinh,
        soLuongToiThieu: source.soLuongToiThieu ?? source.nguongCanhBao ?? defaults.soLuongToiThieu
    };
};

const NguyenLieuForm = ({ isEditing, initialData, onClose, onRefresh }) => {
    // Quản lý state của riêng form này
    const [formData, setFormData] = useState(() => normalizeFormData(initialData));

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                soLuong: Number(formData.soLuong),
                soLuongToiThieu: Number(formData.soLuongToiThieu)
            };

            console.log('[KHO][SAVE] isEditing =', isEditing, 'payload =', payload);
            const response = isEditing
                ? await khoApi.update(payload.maNguyenLieu, payload)
                : await khoApi.create(payload);

            console.log('[KHO][SAVE] response =', response.data);
            alert("Lưu thông tin thành công!");
            onRefresh(); // Gọi hàm load lại bảng của component cha
            onClose();   // Đóng form
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu dữ liệu!");
        }
    };

    return (
    <div className="nl-form-container">
        <div className="nl-form-card">
            {/* Header đổi màu theo trạng thái Sửa/Thêm */}
            <div className={`nl-form-header ${isEditing ? 'editing' : ''}`}>
                <h3>{isEditing ? '📝 CẬP NHẬT NGUYÊN LIỆU' : '📥 NHẬP KHO MỚI'}</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>LADO COFFEE SYSTEM</span>
            </div>

            <form onSubmit={handleSave}>
                <div className="nl-form-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="nl-form-group">
                                <label>Mã định danh</label>
                                <input type="text" className="nl-input" disabled value={formData.maNguyenLieu} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="nl-form-group">
                                <label>Tên nguyên liệu</label>
                                <input 
                                    type="text" 
                                    className="nl-input" 
                                    placeholder="Ví dụ: Sữa đặc, Hạt cà phê..."
                                    required 
                                    value={formData.tenNguyenLieu} 
                                    onChange={e => setFormData({ ...formData, tenNguyenLieu: e.target.value })} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="nl-form-group">
                                <label>Số lượng nhập</label>
                                <input 
                                    type="number" 
                                    className="nl-input" 
                                    required 
                                    step="0.1" 
                                    value={formData.soLuong} 
                                    onChange={e => setFormData({ ...formData, soLuong: e.target.value })} 
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="nl-form-group">
                                <label>Đơn vị tính</label>
                                <select 
                                    className="nl-select" 
                                    value={formData.donViTinh} 
                                    onChange={e => setFormData({ ...formData, donViTinh: e.target.value })}
                                >
                                    <option value="Gam">Gam (g)</option>
                                    <option value="Kg">Kilogam (kg)</option>
                                    <option value="Ml">Mililit (ml)</option>
                                    <option value="Lít">Lít (L)</option>
                                    <option value="Thùng">Thùng</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="nl-form-group">
                                <label style={{ color: 'var(--danger)' }}>Ngưỡng báo động</label>
                                <input 
                                    type="number" 
                                    className="nl-input input-warning" 
                                    value={formData.soLuongToiThieu} 
                                    onChange={e => setFormData({ ...formData, soLuongToiThieu: e.target.value })} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="nl-form-footer">
                    <button type="button" className="btn-lado btn-lado-cancel" onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button type="submit" className="btn-lado btn-lado-save">
                        {isEditing ? 'Lưu thay đổi' : 'Xác nhận nhập kho'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default NguyenLieuForm;
