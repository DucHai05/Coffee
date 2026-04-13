import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wallet, 
  Clock, 
  User, 
  Receipt, 
  AlertCircle, 
  ChevronRight,
  ArrowRightCircle,
  Calendar,
  Lock,
  Unlock,
  Tag
} from 'lucide-react';
import DoanhThuManager from './DoanhThuManager.jsx';
import CaDetail from './CaDetail.jsx';
import HoaDonDetail from '../../components/HoaDon/HoaDonDetail.jsx';
import './CaManager.css';

const API_URL = 'http://localhost:8084/api/ca';
const API_URL_HOADON = 'http://localhost:8081/api/hoadon';
const API_URL_BAN = 'http://localhost:8083/api/ban';

const CaManager = () => {
    const [activeCa, setActiveCa] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [tab, setTab] = useState('orders');
    const [hoaDons, setHoaDons] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openShiftDialog, setOpenShiftDialog] = useState(false);
    const [initialCash, setInitialCash] = useState('');

    useEffect(() => {
        fetchOpenCaState();
        fetchHoaDons();
        fetchBanMap();
    }, []);

    const fetchOpenCaState = async () => {
        try {
            const response = await axios.get(`${API_URL}/kiem-tra-ca-mo`);
            const data = response.data || {};
            setActiveCa(data.ca || null);
            setOpenShiftDialog(data.batBuocMoCa === true);
        } catch (error) {
            console.warn('Lỗi kiểm tra ca, fallback...');
        }
    };

    const fetchBanMap = async () => {
        try {
            const response = await axios.get(API_URL_BAN);
            const map = {};
            (response.data || []).filter((ban) => String(ban?.trangThaiBan || '').trim() !== 'Ẩn').forEach((ban) => {
                if (ban.maBan) map[ban.maBan] = ban.tenBan || ban.maBan;
            });
            setBanMap(map);
        } catch (e) { console.error(e); }
    };

    const fetchHoaDons = async () => {
        try {
            const response = await axios.get(API_URL_HOADON);
            setHoaDons(response.data || []);
        } catch (e) { console.error(e); }
    };

    const handleConfirmOpenCa = async () => {
        const amount = parseFloat(initialCash);
        if (isNaN(amount) || amount < 0) {
            alert('Vui lòng nhập số tiền ban đầu hợp lệ.');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/mo-ca`, null, {
                params: { soTienKet: amount }
            });
            alert(`Mở ca thành công!`);
            setOpenShiftDialog(false);
            setInitialCash('');
            fetchOpenCaState();
        } catch (error) {
            alert(`Không thể mở ca: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCloseCa = async () => {
        if (!activeCa?.maCa) return;
        if (!window.confirm("Hải có chắc muốn kết thúc ca làm việc này không?")) return;
        try {
            await axios.put(`${API_URL}/${activeCa.maCa}/dong-ca`);
            fetchOpenCaState();
            alert(`Đã đóng ca thành công!`);
        } catch (e) { alert('Lỗi khi đóng ca'); }
    };

    const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '0 ₫';
    const getOrderTableName = (order) => order.tenBan || order.ban || banMap[order.maBan] || order.maBan || 'N/A';
    const filteredHoaDons = hoaDons.filter(o => o.maCa === activeCa?.maCa);

    // Xử lý chuyển hướng UI
    if (selectedOrder) return <HoaDonDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;

    if (showDetail && activeCa) {
        return (
            <div className="ca-manager-wrapper">
                <CaDetail ca={activeCa} orders={hoaDons} banMap={banMap} onBack={() => setShowDetail(false)} />
                <div style={{ marginTop: '24px' }}>
                    <DoanhThuManager ca={activeCa} onRefreshCa={fetchOpenCaState} />
                </div>
            </div>
        );
    }

    // TRƯỜNG HỢP: KHÔNG CÓ CA HOẠT ĐỘNG (LOCK SCREEN)
    if (!activeCa && openShiftDialog) {
        return (
            <div className="ca-lock-screen">
                <div className="lock-panel">
                    <div className="lock-icon-box"><Lock size={32} /></div>
                    <h2>Chưa có ca làm việc</h2>
                    <p>Hệ thống yêu cầu khởi tạo ca mới để bắt đầu bán hàng.</p>
                    <div className="shift-form">
                        <label>Số tiền mặt đầu ca (VND)</label>
                        <div className="input-with-icon">
                            <Wallet size={20} />
                            <input 
                                type="number" autoFocus value={initialCash} 
                                onChange={(e) => setInitialCash(e.target.value)} 
                                placeholder="Nhập số tiền đầu ca..."
                            />
                        </div>
                        <button className="btn-open-now" onClick={handleConfirmOpenCa}>
                            <Unlock size={20} /> XÁC NHẬN MỞ CA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ca-manager-wrapper">
            <header className="manager-header">
                <div className="header-title">
                    <h1>Quản lý ca</h1>
                    <p>Theo dõi tình trạng vận hành của cửa hàng</p>
                </div>
                <div className={`ca-status-pill ${activeCa ? 'active' : 'closed'}`}>
                    <span className="dot"></span>
                    {activeCa ? 'Ca đang hoạt động' : 'Chưa mở ca'}
                </div>
            </header>
            {/* THẺ CA HIỆN TẠI */}
            <div className="active-ca-card">
                <div className="card-top">
                    <div className="ca-identity">
                        <div className="ca-icon"><Clock size={24} /></div>
                        <div>
                            <h3>{activeCa?.tenCa || 'Đang chờ ca mới'}</h3>
                            <p><Calendar size={14} /> {activeCa?.ngayThang || '---'}</p>
                        </div>
                    </div>
                    <div className="ca-actions">
                        <button className="btn-detail-ghost" onClick={() => setShowDetail(true)}>
                            Xem chi tiết <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="ca-info-grid">
                    <div className="info-box">
                        <label><Tag size={14}/> Mã ca</label>
                        <span>{activeCa?.maCa || '---'}</span>
                    </div>
                    <div className="info-box">
                        <label><User size={14}/> Nhân viên</label>
                        <span>{activeCa?.maNhanVien || 'N/A'}</span>
                    </div>
                    <div className="info-box">
                        <label><Clock size={14}/> Bắt đầu lúc</label>
                        <span>{activeCa?.gioMoCa?.split('.')[0] || '---'}</span>
                    </div>
                    <div className="info-box highlight">
                        <label><Wallet size={14}/> Tiền đầu ca</label>
                        <span>{formatCurrency(activeCa?.soTienKet)}</span>
                    </div>
                </div>

                <div className="card-footer">
                    <button className="btn-close-ca" onClick={handleCloseCa} disabled={!activeCa}>
                        <ArrowRightCircle size={18} /> KẾT THÚC VÀ ĐÓNG CA
                    </button>
                </div>
            </div>

            {/* DANH SÁCH GIAO DỊCH TRONG CA */}
            <section className="transactions-section">
                <div className="section-header">
                    <div className="tab-group">
                        <button className={`tab-btn active`}>
                            <Receipt size={18} /> Hóa đơn đã thanh toán
                        </button>
                    </div>
                    <span className="count-badge">{filteredHoaDons.length} Bill</span>
                </div>

                <div className="order-grid">
                    {filteredHoaDons.length === 0 ? (
                        <div className="empty-orders">
                            <AlertCircle size={40} color="#94a3b8" />
                            <p>Chưa có giao dịch nào được ghi nhận.</p>
                        </div>
                    ) : (
                        filteredHoaDons.map((order) => (
                            <div
                                key={order.maHoaDon}
                                className="modern-order-card"
                                onClick={() => setSelectedOrder({ ...order, tenBan: getOrderTableName(order) })}
                            >
                                <div className="order-left">
                                    <div className="order-id">
                                        <strong>{order.maHoaDon}</strong>
                                        <span>{getOrderTableName(order)}</span>
                                    </div>
                                    <span className="order-time">{order.thoiGianVao?.split('.')[0]}</span>
                                </div>
                                <div className="order-right">
                                    <div className="order-amount">
                                        {formatCurrency(order.tongTien)}
                                    </div>
                                    <span className="pay-method">{order.phuongThucThanhToan}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default CaManager;