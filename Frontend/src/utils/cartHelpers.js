// src/utils/cartHelpers.js

/**
 * Tinh tong tien hang (chua giam gia)
 */
export const calculateSubTotal = (cart) => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => sum + (Number(item.giaBan || 0) * Number(item.soLuong || 0)), 0);
};

export const getPromoConfig = (promo) => promo?.configs?.[0] || null;

export const getPromoCategory = (config) => {
    return config?.apDungChoLoaiSP || config?.apDungChoMon || 'ALL';
};

export const getItemCategory = (item) => {
    return item?.maLoaiSanPham || item?.maLoaiSP || item?.loaiSanPham?.maLoaiSanPham || item?.loai || null;
};

export const validatePromotion = (promo, subTotal, cart) => {
    const config = getPromoConfig(promo);

    if (!promo || !config) {
        return { valid: false, reason: 'Khuyen mai khong co cau hinh ap dung' };
    }

    const minOrderValue = Number(config.giaTriDonToiThieu || 0);
    if (Number(subTotal || 0) < minOrderValue) {
        return { valid: false, reason: `Don hang chua du ${minOrderValue.toLocaleString('vi-VN')}d` };
    }

    const requiredCategory = getPromoCategory(config);
    if (requiredCategory !== 'ALL') {
        const hasRequiredCategory = (cart || []).some(item => getItemCategory(item) === requiredCategory);
        if (!hasRequiredCategory) {
            return { valid: false, reason: `Don hang phai co it nhat 1 mon thuoc loai ${requiredCategory}` };
        }
    }

    return { valid: true };
};

/**
 * Tinh gia tri duoc giam cua mot chuong trinh KM
 */
export const calculateDiscountValue = (promo, amount) => {
    if (!promo || !amount) return 0;

    const discountValue = Number(promo.giaTri || 0);
    if (promo.loaiKhuyenMai === 'PERCENT') {
        return (Number(amount || 0) * discountValue) / 100;
    }

    return discountValue;
};

/**
 * Tinh tong tien cuoi cung sau khi tru het cac loai giam gia
 */
export const calculateFinalTotal = (subTotal, autoDiscountVal, manualDiscountVal) => {
    const total = Number(subTotal || 0) - Number(autoDiscountVal || 0) - Number(manualDiscountVal || 0);
    return total > 0 ? total : 0;
};
