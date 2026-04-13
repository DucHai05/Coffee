import React, { useState, useEffect } from 'react';
import '../CommonCSS/cartItem.css';

const CartItem = ({ item, idx, onRemove, onClick, onUpdateQty }) => {
    // 1. Tạo state nội bộ để quản lý việc nhập liệu
    const [tempQty, setTempQty] = useState(item.soLuong);

    // 2. Cập nhật state nội bộ nếu món ăn ở lớp cha thay đổi (ví dụ bấm thêm món từ menu)
    useEffect(() => {
        setTempQty(item.soLuong);
    }, [item.soLuong]);

    const handleQtyChange = (e) => {
        e.stopPropagation();
        const val = e.target.value;
        
        // Cho phép hiển thị chuỗi rỗng trên màn hình để user xóa gõ lại
        setTempQty(val); 

        const newQty = parseInt(val);
        // Chỉ báo lên cha nếu là số hợp lệ và lớn hơn 0
        if (!isNaN(newQty) && newQty > 0) {
            onUpdateQty(idx, newQty);
        }
    };

    // Xử lý khi rời khỏi ô input mà đang để trống thì reset về 1
    const handleBlur = () => {
        if (tempQty === "" || parseInt(tempQty) <= 0) {
            setTempQty(1);
            onUpdateQty(idx, 1);
        }
    };

    return (
        <div className="cart-item-row" onClick={() => onClick(idx)}>
            <div className="col-info">
                <span className="item-name">{item.tenSanPham}</span>
                {item.ghiChu && (
                    <span className="item-note-inline">— {item.ghiChu}</span>
                )}
            </div>

            <div className="col-qty" onClick={(e) => e.stopPropagation()}>
                <input
                    type="number"
                    className="qty-input"
                    value={tempQty} // Dùng state nội bộ
                    onChange={handleQtyChange}
                    onBlur={handleBlur} // Tự động sửa nếu user để trống
                    min="1"
                    onFocus={(e) => e.target.select()}
                />
            </div>

            <div className="col-price">
                {(item.giaBan * (parseInt(tempQty) || 0)).toLocaleString()}đ
            </div>

            <div className="col-actions">
                <button 
                    className="remove-btn" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(idx);
                    }}
                >✕</button>
            </div>
        </div>
    );
};

export default CartItem;