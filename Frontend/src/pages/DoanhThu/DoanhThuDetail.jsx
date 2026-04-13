import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { 
  ChevronLeft, 
  Info, 
  PieChart, 
  Package, 
  Receipt, 
  MessageSquare, 
  Zap, 
  User, 
  Calendar, 
  Clock,
  ArrowUpRight,
  CreditCard,
  Banknote
} from 'lucide-react';
import HoaDonDetail from '../../components/HoaDon/HoaDonDetail.jsx';
import './DoanhThuDetail.css';

const API_URL_HOADON = 'http://localhost:8081/api/hoadon';
const API_URL_BAN = 'http://localhost:8083/api/ban';
const API_URL_DOANHTHU = 'http://localhost:8084/api/doanhthu';

const DoanhThuDetail = ({ doanhThu, onBack }) => {
    const [hoaDons, setHoaDons] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (doanhThu?.maCa) fetchRelatedData();
    }, [doanhThu]);

    const fetchRelatedData = async () => {
        try {
            setLoading(true);
            const [hoaDonRes, banRes] = await Promise.all([
                axios.get(`${API_URL_HOADON}/ca/${doanhThu.maCa}`),
                axios.get(API_URL_BAN)
            ]);

            const map = {};
            if (Array.isArray(banRes.data)) {
                banRes.data
                    .filter((ban) => String(ban?.trangThaiBan || '').trim() !== 'Ẩn')
                    .forEach((ban) => {
                    if (ban.maBan) map[ban.maBan] = ban.tenBan || ban.maBan;
                    });
            }
            setBanMap(map);
            setHoaDons(hoaDonRes.data || []);
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Logic xử lý dữ liệu (Giữ nguyên của Hải) ---
    const extractedProducts = useMemo(() => {
        const extracted = [];
        hoaDons.forEach((order) => {
            const items = order.items || order.chiTiet || [];
            items.forEach((item) => {
                extracted.push({
                    maSP: item.maSanPham || '---',
                    tenSP: item.tenSanPham || 'Sản phẩm',
                    loai: item.loai || 'Khác',
                    soLuong: Number(item.soLuong || 0),
                    donGia: Number(item.giaBan || 0),
                    thanhTien: Number(item.thanhTien || (item.soLuong * item.giaBan))
                });
            });
        });
        return extracted;
    }, [hoaDons]);

    const totals = useMemo(() => {
        return hoaDons.reduce((acc, order) => {
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
            if (order.phuongThucThanhToan === 'CASH') acc.cash += amount;
            else if (order.phuongThucThanhToan === 'TRANSFER') acc.transfer += amount;
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [hoaDons]);
    const soTienKet = Number(doanhThu?.ca?.soTienKet ?? doanhThu?.soTienKet ?? 0);

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    if (selectedOrder) {
        return <HoaDonDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    if (loading) return (
        <div className="detail-loading-wrapper">
            <div className="modern-loader"></div>
            <p>Đang trích xuất dữ liệu đối soát...</p>
        </div>
    );

    return (
        <div className="doanhthu-detail-wrapper">
            {/* NAVIGATION BAR */}
            <div className="detail-nav">
                <button className="btn-back-ghost" onClick={onBack}>
                    <ChevronLeft size={20} /> Quay lại
                </button>
                <div className="detail-title">
                    <h1>Báo cáo chi tiết ca</h1>
                    <span className="id-badge">#{doanhThu.maDoanhThu}</span>
                </div>
            </div>

            {/* TOP INFO GRID */}
            <div className="detail-grid-top">
                <div className="detail-card info-card">
                    <div className="card-header"><Info size={18}/> <h3>Thông tin ca làm việc</h3></div>
                    <div className="info-body">
                        <div className="info-line"><label><Clock size={14}/> Mã ca:</label> <span>{doanhThu.ca?.maCa}</span></div>
                        <div className="info-line"><label><User size={14}/> Nhân viên:</label> <span>{doanhThu.ca?.maNhanVien || 'N/A'}</span></div>
                        <div className="info-line"><label><Calendar size={14}/> Ngày:</label> <span>{doanhThu.ca?.ngayThang}</span></div>
                        <div className="info-line"><label><Zap size={14}/> Trạng thái:</label> <span className="status-pill closed">Đã kết thúc</span></div>
                    </div>
                </div>

                <div className="detail-card stats-card">
                    <div className="card-header"><PieChart size={18}/> <h3>Tổng hợp tài chính</h3></div>
                    <div className="stats-inner-grid">
                        <div className="mini-stat">
                            <label>Tiền mặt</label>
                            <div className="val cash"><Banknote size={16}/> {formatCurrency(totals.cash)}</div>
                        </div>
                        <div className="mini-stat">
                            <label>Chuyển khoản</label>
                            <div className="val transfer"><CreditCard size={16}/> {formatCurrency(totals.transfer)}</div>
                        </div>
                        <div className="mini-stat total">
                            <label>Tổng doanh thu thực tế</label>
                            <div className="val big">{formatCurrency(totals.cash + totals.transfer)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCTS SECTION */}
            <div className="detail-section">
                <div className="section-header-modern">
                    <div className="h-left"><Package size={20}/> <h3>Sản phẩm đã bán ({extractedProducts.length})</h3></div>
                </div>
                <div className="modern-table-container">
                    <table className="modern-data-table">
                        <thead>
                            <tr>
                                <th>Mã SP</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại</th>
                                <th>SL</th>
                                <th>Đơn giá</th>
                                <th style={{textAlign: 'right'}}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extractedProducts.length === 0 ? (
                                <tr><td colSpan="6" className="table-empty">Trống</td></tr>
                            ) : (
                                extractedProducts.map((p, idx) => (
                                    <tr key={idx}>
                                        <td className="txt-mono">{p.maSP}</td>
                                        <td className="txt-bold">{p.tenSP}</td>
                                        <td><span className="cat-pill">{p.loai}</span></td>
                                        <td>{p.soLuong}</td>
                                        <td>{formatCurrency(p.donGia)}</td>
                                        <td style={{textAlign: 'right'}} className="txt-indigo">{formatCurrency(p.thanhTien)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ORDERS SECTION */}
            <div className="detail-section">
                <div className="section-header-modern">
                    <div className="h-left"><Receipt size={20}/> <h3>Lịch sử hóa đơn ({hoaDons.length})</h3></div>
                </div>
                <div className="orders-feed">
                    {hoaDons.map((order) => (
                        <div
                            key={order.maHoaDon}
                            className="feed-item"
                            onClick={() => setSelectedOrder({ ...order, tenBan: banMap[order.maBan] || order.maBan })}
                        >
                            <div className="order-left">
                                <div className="order-id">
                                    <strong>{order.maHoaDon}</strong>
                                    <span>{banMap[order.maBan] || order.maBan}</span>
                                </div>
                                <span className="order-time">{order.thoiGianVao?.split('.')[0]}</span>
                            </div>
                            <div className="order-right">
                                <span className="order-price">{formatCurrency(order.tongTien)}</span>
                                <span className="pay-method">{order.phuongThucThanhToan}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* NOTES GRID */}
            <div className="detail-grid-bottom">
                <div className="detail-card note-card">
                    <div className="card-header"><MessageSquare size={18}/> <h3>Ghi chú bàn giao</h3></div>
                    <p>{doanhThu.ca?.ghiChu || 'Không có ghi chú.'}</p>
                </div>
                <div className="detail-card note-card">
                    <div className="card-header"><ArrowUpRight size={18}/> <h3>Chương trình áp dụng</h3></div>
                    <p>{doanhThu.ca?.khuyenMai || 'Không có khuyến mãi.'}</p>
                </div>
            </div>
        </div>
    );
};

export default DoanhThuDetail;
