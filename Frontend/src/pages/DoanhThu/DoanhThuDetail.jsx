import React, { useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import { hoaDonApi, tableApi, phieuThuChiApi, productApi } from '../../api/APIGateway';
=======
import { hoaDonApi, tableApi, doanhthuApi } from '../../api/APIGateway';
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
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
<<<<<<< HEAD
  Banknote,
  ArrowDownLeft
=======
  Banknote
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
} from 'lucide-react';
import HoaDonDetail from '../../components/HoaDon/HoaDonDetail.jsx';
import './DoanhThuDetail.css';

const DoanhThuDetail = ({ doanhThu, onBack }) => {
    const [hoaDons, setHoaDons] = useState([]);
<<<<<<< HEAD
    const [phieuThuChi, setPhieuThuChi] = useState([]);
    const [products, setProducts] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const maCa = doanhThu?.maCa || doanhThu?.ca?.maCa;

    useEffect(() => {
        if (maCa) fetchRelatedData();
    }, [maCa]);

    const normalizePaymentMethod = (method) => {
        const normalized = String(method || '').trim().toUpperCase();
        if (['CASH', 'TIỀN MẶT', 'TIEN MAT'].includes(normalized)) return 'cash';
        if (['TRANSFER', 'CHUYỂN KHOẢN', 'CHUYEN KHOAN', 'CK', 'BANK'].includes(normalized)) return 'transfer';
        return 'other';
    };

    const normalizeVoucherType = (type) => {
        const normalized = String(type || '').trim().toUpperCase();
        if (normalized === 'THU') return 'thu';
        if (normalized === 'CHI') return 'chi';
        return 'other';
    };
=======
    const [banMap, setBanMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (doanhThu?.maCa) fetchRelatedData();
    }, [doanhThu]);
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7

    const fetchRelatedData = async () => {
        try {
            setLoading(true);
<<<<<<< HEAD
            const [hoaDonRes, banRes, phieuThuChiRes, productRes] = await Promise.all([
                hoaDonApi.getByCa(maCa),
                tableApi.getTables(),
                phieuThuChiApi.getByCa(maCa),
                productApi.getProducts()
=======
            const [hoaDonRes, banRes] = await Promise.all([
                hoaDonApi.getByCa(doanhThu.maCa),
                tableApi.getTables()
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
            ]);

            const map = {};
            if (Array.isArray(banRes.data)) {
                banRes.data.forEach((ban) => {
                    if (ban.maBan) map[ban.maBan] = ban.tenBan || ban.maBan;
                });
            }
            setBanMap(map);
            setHoaDons(hoaDonRes.data || []);
<<<<<<< HEAD
            setPhieuThuChi(phieuThuChiRes.data || []);
            setProducts(productRes.data || []);
=======
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Logic xử lý dữ liệu (Giữ nguyên của Hải) ---
    const extractedProducts = useMemo(() => {
<<<<<<< HEAD
        const productMap = new Map(
            (Array.isArray(products) ? products : []).map((product) => [product.maSanPham, product])
        );
        const groupedProducts = new Map();

        hoaDons.forEach((order) => {
            const items = order.chiTietHDs || order.items || order.chiTiet || [];
            items.forEach((item) => {
                const maSP = item.maSanPham || '---';
                const productInfo = productMap.get(maSP);
                const soLuong = Number(item.soLuong || 0);
                const donGia = Number(item.donGia ?? item.giaBan ?? productInfo?.giaBan ?? 0);
                const current = groupedProducts.get(maSP) || {
                    maSP,
                    tenSP: productInfo?.tenSanPham || item.tenSanPham || item.tenMon || maSP,
                    loai: productInfo?.tenLoaiSanPham || item.loai || 'Khác',
                    soLuong: 0,
                    donGia,
                    thanhTien: 0,
                };

                current.soLuong += soLuong;
                current.donGia = donGia;
                current.thanhTien += soLuong * donGia;
                groupedProducts.set(maSP, current);
            });
        });

        return Array.from(groupedProducts.values());
    }, [hoaDons, products]);
=======
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
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7

    const totals = useMemo(() => {
        return hoaDons.reduce((acc, order) => {
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
<<<<<<< HEAD
            const method = normalizePaymentMethod(order.phuongThucThanhToan);
            if (method === 'cash') acc.cash += amount;
            else if (method === 'transfer') acc.transfer += amount;
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [hoaDons]);

    const thuChiTotals = useMemo(() => {
        return phieuThuChi.reduce((acc, item) => {
            const amount = Number(item.soTien || 0);
            const type = normalizeVoucherType(item.loaiPhieu);
            if (type === 'thu') acc.thu += amount;
            else if (type === 'chi') acc.chi += amount;
            return acc;
        }, { thu: 0, chi: 0 });
    }, [phieuThuChi]);

    const summary = {
        cash: totals.cash || Number(doanhThu?.tienMat || 0),
        transfer: totals.transfer || Number(doanhThu?.tienCK || 0),
        thu: thuChiTotals.thu || Number(doanhThu?.tienThu || 0),
        chi: thuChiTotals.chi || Number(doanhThu?.tienChi || 0),
    };
=======
            if (order.phuongThucThanhToan === 'CASH') acc.cash += amount;
            else if (order.phuongThucThanhToan === 'TRANSFER') acc.transfer += amount;
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [hoaDons]);
    const soTienKet = Number(doanhThu?.ca?.soTienKet ?? doanhThu?.soTienKet ?? 0);
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7

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
<<<<<<< HEAD
                            <div className="val cash"><Banknote size={16}/> {formatCurrency(summary.cash)}</div>
                        </div>
                        <div className="mini-stat">
                            <label>Chuyển khoản</label>
                            <div className="val transfer"><CreditCard size={16}/> {formatCurrency(summary.transfer)}</div>
                        </div>
                        <div className="mini-stat">
                            <label>Tiền thu</label>
                            <div className="val income"><ArrowUpRight size={16}/> {formatCurrency(summary.thu)}</div>
                        </div>
                        <div className="mini-stat">
                            <label>Tiền chi</label>
                            <div className="val expense"><ArrowDownLeft size={16}/> {formatCurrency(summary.chi)}</div>
                        </div>
                        <div className="mini-stat total">
                            <label>Tổng doanh thu thực tế</label>
                            <div className="val big">{formatCurrency(summary.cash + summary.transfer)}</div>
=======
                            <div className="val cash"><Banknote size={16}/> {formatCurrency(totals.cash)}</div>
                        </div>
                        <div className="mini-stat">
                            <label>Chuyển khoản</label>
                            <div className="val transfer"><CreditCard size={16}/> {formatCurrency(totals.transfer)}</div>
                        </div>
                        <div className="mini-stat total">
                            <label>Tổng doanh thu thực tế</label>
                            <div className="val big">{formatCurrency(totals.cash + totals.transfer)}</div>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
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
