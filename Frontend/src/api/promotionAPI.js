import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/promotions';
const CONFIG_URL = 'http://localhost:8082/api/promotion-configs'; // URL mới cho thằng Con

export const promoApi = {
    // --- NHÓM 1: QUẢN LÝ KHUYẾN MÃI (Cha) ---
    getActivePromos: () => axios.get(`${BASE_URL}/active`),
    getAllPromos: () => axios.get(`${BASE_URL}`),
    deletePromo: (id) => axios.delete(`${BASE_URL}/${id}`),
    updateStatus: (id) => axios.patch(`${BASE_URL}/${id}/status`),
    createPromo: (data) => axios.post(`${BASE_URL}`, data),
    updatePromo: (id, data) => axios.put(`${BASE_URL}/${id}`, data),


    getConfigsByPromo: (maKM) => axios.get(`${CONFIG_URL}/promo/${maKM}`),


    checkEligibility: (checkData) => axios.post(`${CONFIG_URL}/check`, checkData)
};