import axios from 'axios';

// ĐỊA CHỈ DUY NHẤT: Trỏ về API Gateway
const GATEWAY_URL = 'http://localhost:8080';

// Hằng số hỗ trợ lọc bàn
const HIDDEN_TABLE_STATUS = '\u1EA8n';
const isVisibleTable = (table) => String(table?.trangThaiBan || '').trim() !== HIDDEN_TABLE_STATUS;

// -----------------------------------------------------------
// 1. SERVICE TABLE (Gateway: /api/table/**)
// -----------------------------------------------------------
export const tableApi = {
    getTables: () => axios.get(`${GATEWAY_URL}/api/table/ban`).then((res) => ({
        ...res, data: Array.isArray(res.data) ? res.data.filter(isVisibleTable) : res.data
    })),
    getTableName: (maBan) => axios.get(`${GATEWAY_URL}/api/table/ban/${maBan}`),
    getBanTrong: (maBan) => axios.get(`${GATEWAY_URL}/api/table/ban/ban-trong/${maBan}`),
    getKhuVuc: () => axios.get(`${GATEWAY_URL}/api/table/khuvuc`),
    getBanByKhuVuc: (maKhuVuc) => axios.get(`${GATEWAY_URL}/api/table/ban/khuvuc/${maKhuVuc}`),
    createBan: (data) => axios.post(`${GATEWAY_URL}/api/table/ban`, data),
    updateBan: (maBan, data) => axios.put(`${GATEWAY_URL}/api/table/ban/${maBan}`, data),
    deleteBan: (maBan) => axios.delete(`${GATEWAY_URL}/api/table/ban/${maBan}`),
    updateTrangThai: (maBan, status = 'Pending') =>
        axios.put(`${GATEWAY_URL}/api/table/ban/updateTrangThai/${maBan}?status=${status}`),
};

export const khuVucApi = {
    getAll: () => axios.get(`${GATEWAY_URL}/api/table/khuvuc`),
    create: (data) => axios.post(`${GATEWAY_URL}/api/table/khuvuc`, data),
    update: (id, data) => axios.put(`${GATEWAY_URL}/api/table/khuvuc/${id}`, data),
    delete: (id) => axios.delete(`${GATEWAY_URL}/api/table/khuvuc/${id}`),
};

export const chiTietHDApi = {
    getByHoaDon: (maHoaDon) => axios.get(`${GATEWAY_URL}/api/cafe/chitiethd/hoadon/${maHoaDon}`),
};

// -----------------------------------------------------------
// 2. SERVICE PROMOTION (Gateway: /api/promotion/**)
// -----------------------------------------------------------
export const promoApi = {
    getActivePromos: () => axios.get(`${GATEWAY_URL}/api/promotion/promotions/active`),
    getAllPromos: () => axios.get(`${GATEWAY_URL}/api/promotion/promotions`),
    getConfigsByPromo: (maKM) => axios.get(`${GATEWAY_URL}/api/promotion/promotion-configs/promo/${maKM}`),
    // ... các hàm khác giữ nguyên tiền tố /api/promotion
};

// -----------------------------------------------------------
// 3. SERVICE PRODUCT (Gateway: /api/product/**)
// -----------------------------------------------------------
export const productApi = {
    getProducts: () => axios.get(`${GATEWAY_URL}/api/product/v1/san-pham`),
    getLoaiSP: () => axios.get(`${GATEWAY_URL}/api/product/v1/loai-san-pham`),
    create: (data) => axios.post(`${GATEWAY_URL}/api/product/v1/san-pham`, data),
    upload: (formData) => axios.post(`${GATEWAY_URL}/api/product/v1/upload`, formData), // Sửa lại /v1/upload
};

// -----------------------------------------------------------
// 4. SERVICE CAFE (Gateway: /api/cafe/**)
// -----------------------------------------------------------
export const orderApi = {
    // Trang Order cần lấy danh sách sản phẩm qua Gateway
    getProducts: () => axios.get(`${GATEWAY_URL}/api/product/v1/san-pham`), 
    
    loadBan: (maBan) => axios.get(`${GATEWAY_URL}/api/cafe/orders/loadBan/${maBan}`),
    staffCreate: (orderData) => axios.post(`${GATEWAY_URL}/api/cafe/orders/staff-create`, orderData),
    finalPayment: (paymentPayload) => axios.post(`${GATEWAY_URL}/api/cafe/payments/final-payment`, paymentPayload),
};

export const hoaDonApi = {
    getAll: () => axios.get(`${GATEWAY_URL}/api/cafe/hoadon`), // Thêm /api/cafe vào đầu
    getByCa: (maCa) => axios.get(`${GATEWAY_URL}/api/cafe/hoadon/ca/${maCa}`),
};

// -----------------------------------------------------------
// 5. SERVICE DOANH THU (Gateway: /api/doanhthu/**)
// -----------------------------------------------------------
export const caApi = {
    checkOpenCa: () => axios.get(`${GATEWAY_URL}/api/doanhthu/ca/kiem-tra-ca-mo`),
    openCa: (soTienKet) => axios.post(`${GATEWAY_URL}/api/doanhthu/ca/mo-ca`, null, { params: { soTienKet } }),
    closeCa: (maCa) => axios.put(`${GATEWAY_URL}/api/doanhthu/ca/${maCa}/dong-ca`),
    getAll: () => axios.get(`${GATEWAY_URL}/api/doanhthu/ca`),
};

export const doanhthuApi = {
    getMaCaDangMo: () => axios.get(`${GATEWAY_URL}/api/doanhthu/ca/getMaCaDangMo`),
    getByCa: (maCa) => axios.get(`${GATEWAY_URL}/api/doanhthu/doanhthu/ca/${maCa}`),
    getAll: () => axios.get(`${GATEWAY_URL}/api/doanhthu/doanhthu`),
    updateAfterPayment: (maCa, phuongThuc, soTien) => {
        const payload = { amount: soTien, method: phuongThuc };
        return axios.put(`${GATEWAY_URL}/api/doanhthu/doanhthu/update-after-payment/${maCa}`, payload);
    },
};

export const phieuThuChiApi = {
    getByCa: (maCa) => axios.get(`${GATEWAY_URL}/api/doanhthu/phieuthuchi/ca/${maCa}`),
    create: (data) => axios.post(`${GATEWAY_URL}/api/doanhthu/phieuthuchi`, data),
};

// -----------------------------------------------------------
// 6. SERVICE STORE (Gateway: /api/store/**)
// -----------------------------------------------------------
export const khoApi = {
    getAll: () => axios.get(`${GATEWAY_URL}/api/store/nguyen-lieu`), // Sửa /api/kho thành /api/store
    create: (data) => axios.post(`${GATEWAY_URL}/api/store/nguyen-lieu`, data),
};

// -----------------------------------------------------------
// 7. SERVICE USER (Gateway: /api/user/**)
// -----------------------------------------------------------
const AUTH_API = `${GATEWAY_URL}/api/user/auth`;
export const authApi = {
    baseURL: () => `${GATEWAY_URL}/user`,
    login: (data) => axios.post(`${AUTH_API}/login`, data),
    register: (data) => axios.post(`${AUTH_API}/register`, data),
    changePassword: (data, token) => axios.post(`${AUTH_API}/change-password`, data, { headers: { Authorization: `Bearer ${token}` } }),
    forgotPassword: (email) => axios.post(`${AUTH_API}/forgot`, { email }),
    verifyOTP: (email, otp) => axios.post(`${AUTH_API}/verify-otp`, { email, otp: otp.toString() }),
    resetPassword: (email, otp, newPassword) => axios.post(`${AUTH_API}/reset`, { email, otp: otp.toString(), newPassword }),
    getProfile: (token) => axios.get(`${GATEWAY_URL}/api/user/nhan-vien/me`, { headers: { Authorization: `Bearer ${token}` } }),

};

// APIGateway.js
export const employeeApi = {
    // 1. Lấy danh sách (Đã ok)
    getAll: (token) => axios.get(`${GATEWAY_URL}/api/user/nhan-vien`, {
        headers: { Authorization: `Bearer ${token}` } 
    }),

    // 2. Thêm mới (Cũng cần token để biết ai là Admin đang thêm)
    create: (data, token) => axios.post(`${GATEWAY_URL}/api/user/nhan-vien`, data, {
        headers: { Authorization: `Bearer ${token}` }
    }),

    // 3. Cập nhật
    update: (id, data, token) => axios.put(`${GATEWAY_URL}/api/user/nhan-vien/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    }),

    // 4. Xóa
    delete: (id, token) => axios.delete(`${GATEWAY_URL}/api/user/nhan-vien/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
};

// -----------------------------------------------------------
// 8. SERVICE NOTIFICATION (Gateway: /api/notification/**)
// -----------------------------------------------------------
// TRONG APIGateway.js
export const notificationApi = {
     getAllNoti: () => axios.get(`${GATEWAY_URL}/notification/notifications`),
     getByEmployee: (maNV) => axios.get(`${GATEWAY_URL}/api/notification/notifications/list/${maNV}`),
     create: (data, token) => axios.post(`${GATEWAY_URL}/api/notification/notifications/create`, data, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    
    // Giữ các hàm khác
    getUnreadCount: (maNV) => axios.get(`${GATEWAY_URL}/api/notification/notifications/unread-count/${maNV}`),
    markAsRead: (id) => axios.put(`${GATEWAY_URL}/api/notification/notifications/read/${id}`),
};

// -----------------------------------------------------------
// 9. SERVICE SALARY (Gateway: /api/salary/**)
// -----------------------------------------------------------
export const salaryApi = {
    getStatus: (maNV, token) => axios.get(`${GATEWAY_URL}/api/salary/cham-cong/status/${maNV}`, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    
    getActiveDays: (maNV, month, year, token) => axios.get(`${GATEWAY_URL}/api/salary/cham-cong/active-days`, {
        params: { maNV, month, year },
        headers: { Authorization: `Bearer ${token}` }
    }),

    getHistory: (maNV, month, year, token) => axios.get(`${GATEWAY_URL}/api/salary/cham-cong/history`, {
        params: { maNV, month, year },
        headers: { Authorization: `Bearer ${token}` }
    }),

    thucHien: (maNV, token) => axios.post(`${GATEWAY_URL}/api/salary/cham-cong/thuc-hien`, { maNV }, {
        headers: { Authorization: `Bearer ${token}` }
    }),

    getAll: (month, year, token) => axios.get(`${GATEWAY_URL}/api/salary/all`, {
        params: { thang: month, nam: year },
        headers: { Authorization: `Bearer ${token}` }
    }),

    calculateAll: (month, year, token) => axios.post(`${GATEWAY_URL}/api/salary/calculate-all`, {
        thang: month,
        nam: year
    }, {
        headers: { Authorization: `Bearer ${token}` }
    }),

    pay: (maNV, month, year, token) => axios.put(`${GATEWAY_URL}/api/salary/pay/${maNV}`, null, {
        params: { thang: month, nam: year },
        headers: { Authorization: `Bearer ${token}` }
    }),

    create: (data, token) => axios.post(`${GATEWAY_URL}/api/salary/create`, data, {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

export const loaiSanPhamApi = {
    getAll: () => axios.get(`${GATEWAY_URL}/api/product/v1/loai-san-pham`),
    create: (data) => axios.post(`${GATEWAY_URL}/api/product/v1/loai-san-pham`, data),
    update: (id, data) => axios.put(`${GATEWAY_URL}/api/product/v1/loai-san-pham/${id}`, data),
    delete: (id) => axios.delete(`${GATEWAY_URL}/api/product/v1/loai-san-pham/${id}`),
};


export const saveToken = (token) => localStorage.setItem("token", token);
export const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };
