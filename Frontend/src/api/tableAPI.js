import axios from 'axios';

const BASE_URL = 'http://localhost:8083/api/ban';
const KHUVUC_URL = 'http://localhost:8083/api/khuvuc';
const HIDDEN_TABLE_STATUS = '\u1EA8n';

const isVisibleTable = (table) => String(table?.trangThaiBan || '').trim() !== HIDDEN_TABLE_STATUS;

export const tableApi = {
    getTables: () =>
        axios.get(`${BASE_URL}`).then((response) => ({
            ...response,
            data: Array.isArray(response.data) ? response.data.filter(isVisibleTable) : response.data
        })),

    getKhuVuc: () => axios.get(`${KHUVUC_URL}`),

    updateTrangThai: (maBan, status = 'Pending') =>
        axios.put(`${BASE_URL}/updateTrangThai/${maBan}?status=${status}`),

    getBanTrong: (maBan) => axios.get(`${BASE_URL}/ban-trong/${maBan}`),

    getTableName: (maBan) => axios.get(`${BASE_URL}/${maBan}`)
};
