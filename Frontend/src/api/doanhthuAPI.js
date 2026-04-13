import axios from 'axios';

const BASE_URL = 'http://localhost:8084/api/doanhthu';
const BASE_URL_2 = 'http://localhost:8084/api/ca';
const API_URL_HOADON = 'http://localhost:8081/api/hoadon';

export const doanhthuApi = {
    // Lấy MaCa đang mở
    getMaCaDangMo: (maCa) => axios.get(`${BASE_URL_2}/getMaCaDangMo`),

    updateAfterPayment: (maCa, phuongThuc, soTien) => {
        const paymentPayload = {
            amount: soTien,
            method: phuongThuc
        };
        return axios.put(`${BASE_URL}/update-after-payment/${maCa}`, paymentPayload);
    },
    getAll: () => axios.get(`${BASE_URL}`),
};