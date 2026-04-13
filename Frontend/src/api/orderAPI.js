import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/orders';
const PAYMENT_URL = 'http://localhost:8081/api/payments';
const Product_URL = 'http://localhost:8087/api/v1/san-pham';
const LoaiSP_URL = 'http://localhost:8087/api/v1/loai-san-pham';
const User_URL = 'http://localhost:8086/api/nhan-vien';

export const orderApi = {
    // Lấy danh sách sản phẩm
    getProducts: () => axios.get(`${Product_URL}`),
    // Lấy danh sách loại sản phẩm
    getLoaiSP: () => axios.get(`${LoaiSP_URL}`),

    // Lấy thông tin hóa đơn hiện tại của bàn
    loadBan: (maBan) => axios.get(`${BASE_URL}/loadBan/${maBan}`),

    // Tạo đơn hàng mới (Xuống bếp)
    staffCreate: (orderData) => axios.post(`${BASE_URL}/staff-create`, orderData),

    // Chốt thanh toán cuối cùng
    finalPayment: (paymentPayload) => axios.post(`${PAYMENT_URL}/final-payment`, paymentPayload),

    // API này sẽ gọi đến Backend để cộng dồn món vào hóa đơn cũ
    addItems: (data) => axios.put(`${BASE_URL}/add-items`, data),
    
    // API lấy hóa đơn hiện tại của bàn
    removeOrderItem: (maChiTietHD) => axios.delete(`${BASE_URL}/remove-item/${maChiTietHD}`)

    
};