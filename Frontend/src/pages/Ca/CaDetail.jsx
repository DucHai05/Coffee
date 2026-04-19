import React, { useState, useEffect, useMemo } from 'react';
<<<<<<< HEAD
import { doanhthuApi, hoaDonApi, productApi } from '../../api/APIGateway';
=======
import { doanhthuApi, hoaDonApi } from '../../api/APIGateway';
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
import {
  ChevronLeft,
  Clock,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ShoppingBag,
  Search,
  Filter,
  FileText,
  Tag
} from 'lucide-react';
import './CaDetail.css';

<<<<<<< HEAD
const ALL_CATEGORY = 'Tat ca';

const CaDetail = ({ ca, onBack }) => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState(ALL_CATEGORY);
    const [doanhThu, setDoanhThu] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
=======
const CaDetail = ({ ca, onBack }) => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('Tất cả');
    const [doanhThu, setDoanhThu] = useState(null);
    const [orders, setOrders] = useState([]);
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!ca?.maCa) return;
            try {
                setLoading(true);
<<<<<<< HEAD
                const [resDoanhThu, resHoaDon, resProducts] = await Promise.all([
                    doanhthuApi.getByCa(ca.maCa),
                    hoaDonApi.getByCa(ca.maCa),
                    productApi.getProducts()
=======
                const [resDoanhThu, resHoaDon] = await Promise.all([
                    doanhthuApi.getByCa(ca.maCa),
                    hoaDonApi.getByCa(ca.maCa)
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                ]);

                if (resDoanhThu.data) {
                    setDoanhThu(Array.isArray(resDoanhThu.data) ? resDoanhThu.data[0] : resDoanhThu.data);
                }
                setOrders(resHoaDon.data || []);
<<<<<<< HEAD
                setProducts(resProducts.data || []);
            } catch (error) {
                console.error('Loi fetch du lieu:', error);
=======
            } catch (error) {
                console.error('Lỗi fetch dữ liệu:', error);
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ca]);

    const totals = useMemo(() => {
        return orders.reduce((acc, order) => {
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
<<<<<<< HEAD
            const method = String(order.phuongThucThanhToan || '').trim().toUpperCase();
            if (method === 'CASH' || method === 'TIEN MAT' || method === 'TIỀN MẶT') acc.cash += amount;
            else if (method === 'TRANSFER' || method === 'CHUYEN KHOAN' || method === 'CHUYỂN KHOẢN') acc.transfer += amount;
=======
            const method = order.phuongThucThanhToan;
            if (method === 'CASH' || method === 'Tiền mặt') acc.cash += amount;
            else if (method === 'TRANSFER' || method === 'Chuyển khoản') acc.transfer += amount;
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [orders]);

    const allProductsInOrders = useMemo(() => {
<<<<<<< HEAD
        const productMap = new Map(
            (Array.isArray(products) ? products : []).map((product) => [product.maSanPham, product])
        );
        const groupedProducts = new Map();

        orders.forEach((order) => {
            const items = order.chiTietHDs || order.items || order.chiTiet || [];
            items.forEach((item) => {
                const maSP = item.maSanPham || '---';
                const productInfo = productMap.get(maSP);
                const soLuong = Number(item.soLuong || 0);
                const donGia = Number(item.donGia ?? item.giaBan ?? productInfo?.giaBan ?? 0);
                const current = groupedProducts.get(maSP) || {
                    maSP,
                    tenSP: productInfo?.tenSanPham || item.tenSanPham || item.tenMon || maSP,
                    loai: productInfo?.tenLoaiSanPham || item.loai || 'Khac',
                    soLuong: 0,
                    donGia,
                    thanhTien: 0
                };

                current.soLuong += soLuong;
                current.donGia = donGia;
                current.thanhTien += soLuong * donGia;
                groupedProducts.set(maSP, current);
            });
        });

        return Array.from(groupedProducts.values());
    }, [orders, products]);

    const categories = useMemo(() => {
        return [ALL_CATEGORY, ...Array.from(new Set(allProductsInOrders.map((item) => item.loai)))];
=======
        const extracted = [];
        orders.forEach((order) => {
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
    }, [orders]);

    const categories = useMemo(() => {
        return ['Tất cả', ...Array.from(new Set(allProductsInOrders.map((item) => item.loai)))];
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
    }, [allProductsInOrders]);

    const filteredProducts = useMemo(() => {
        return allProductsInOrders.filter((product) => {
<<<<<<< HEAD
            const matchesCategory = category === ALL_CATEGORY || product.loai === category;
=======
            const matchesCategory = category === 'Tất cả' || product.loai === category;
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
            const matchesSearch =
                !searchText || `${product.maSP} ${product.tenSP}`.toLowerCase().includes(searchText.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allProductsInOrders, category, searchText]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const tienMatTrongKet = Number(ca?.soTienKet || 0);

    if (loading) return (
        <div className="ca-loading-container">
            <div className="loader"></div>
<<<<<<< HEAD
            <p>Dang doi soat du lieu ca {ca.maCa}...</p>
=======
            <p>Đang đối soát dữ liệu ca {ca.maCa}...</p>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
        </div>
    );

    return (
        <div className="ca-detail-container">
            <div className="ca-detail-nav">
                <button className="btn-back-ghost" onClick={onBack}>
<<<<<<< HEAD
                    <ChevronLeft size={20} /> Quay lai danh sach
                </button>
                <div className="ca-title-group">
                    <h1>Chi tiet ca lam viec</h1>
                    <span className={`badge-status ${ca.trangThai === 'Da dong' ? 'closed' : 'active'}`}>
                        {ca.trangThai || 'Dang mo'}
=======
                    <ChevronLeft size={20} /> Quay lại danh sách
                </button>
                <div className="ca-title-group">
                    <h1>Chi tiết ca làm việc</h1>
                    <span className={`badge-status ${ca.trangThai === 'Đã đóng' ? 'closed' : 'active'}`}>
                        {ca.trangThai || 'Đang mở'}
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                    </span>
                </div>
            </div>

            <div className="ca-detail-grid">
                <div className="ca-info-card">
                    <div className="card-header">
<<<<<<< HEAD
                        <Clock size={20} /> <h3>Thong tin van hanh</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <label><Tag size={14}/> Ma ca</label>
                            <span>{ca.maCa}</span>
                        </div>
                        <div className="info-item">
                            <label><User size={14}/> Nhan vien</label>
                            <span>{ca.tenNhanVien || ca.maNhanVien}</span>
                        </div>
                        <div className="info-item">
                            <label><Calendar size={14}/> Ngay lam viec</label>
                            <span>{ca.ngayThang}</span>
                        </div>
                        <div className="info-item">
                            <label><Clock size={14}/> Thoi gian</label>
=======
                        <Clock size={20} /> <h3>Thông tin vận hành</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <label><Tag size={14}/> Mã ca</label>
                            <span>{ca.maCa}</span>
                        </div>
                        <div className="info-item">
                            <label><User size={14}/> Nhân viên</label>
                            <span>{ca.tenNhanVien || ca.maNhanVien}</span>
                        </div>
                        <div className="info-item">
                            <label><Calendar size={14}/> Ngày làm việc</label>
                            <span>{ca.ngayThang}</span>
                        </div>
                        <div className="info-item">
                            <label><Clock size={14}/> Thời gian</label>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                            <span>{ca.gioMoCa} - {ca.gioDongCa || '---'}</span>
                        </div>
                    </div>
                </div>

                <div className="ca-revenue-card">
                    <div className="card-header">
<<<<<<< HEAD
                        <DollarSign size={20} /> <h3>Tong hop doanh thu</h3>
=======
                        <DollarSign size={20} /> <h3>Tổng hợp doanh thu</h3>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                    </div>
                    <div className="revenue-stats-grid">
                        <div className="stat-box">
                            <div className="stat-icon cash"><DollarSign size={20}/></div>
                            <div className="stat-info">
<<<<<<< HEAD
                                <label>Tien mat</label>
=======
                                <label>Tiền mặt</label>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                <h4>{formatCurrency(totals.cash || doanhThu?.tienMat)}</h4>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon transfer"><CreditCard size={20}/></div>
                            <div className="stat-info">
<<<<<<< HEAD
                                <label>Chuyen khoan</label>
=======
                                <label>Chuyển khoản</label>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                <h4>{formatCurrency(totals.transfer || doanhThu?.tienCK)}</h4>
                            </div>
                        </div>
                        <div className="stat-box thu-chi-combined">
                            <div className="stat-info full">
                                <div className="thu-chi-columns">
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-success">
                                            <ArrowUpCircle size={16}/> Thu
                                        </span>
                                        <strong className="text-success">+{formatCurrency(doanhThu?.tienThu)}</strong>
                                    </div>
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-danger">
                                            <ArrowDownCircle size={16}/> Chi
                                        </span>
                                        <strong className="text-danger">-{formatCurrency(doanhThu?.tienChi)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon wallet"><Wallet size={20}/></div>
                            <div className="stat-info">
<<<<<<< HEAD
                                <label>Tien mat trong ket</label>
=======
                                <label>Tiền mặt trong két</label>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                <h4>{formatCurrency(tienMatTrongKet)}</h4>
                            </div>
                        </div>
                        <div className="stat-box full-width highlight">
                            <div className="stat-icon wallet"><Wallet size={24}/></div>
                            <div className="stat-info">
<<<<<<< HEAD
                                <label>Tong thuc thu trong ca (Doanh so)</label>
=======
                                <label>Tổng thực thu trong ca (Doanh số)</label>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                <h2>{formatCurrency(totals.cash + totals.transfer)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ca-products-section">
                <div className="section-header">
                    <div className="header-left">
                        <ShoppingBag size={22} />
<<<<<<< HEAD
                        <h3>San pham da ban trong ca</h3>
=======
                        <h3>Sản phẩm đã bán trong ca</h3>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                    </div>
                    <div className="header-filters">
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
<<<<<<< HEAD
                                placeholder="Tim mon..."
=======
                                placeholder="Tìm món..."
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <div className="filter-select">
                            <Filter size={18} />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="ca-table-wrapper">
                    <table className="ca-modern-table">
                        <thead>
                            <tr>
<<<<<<< HEAD
                                <th>Ma SP</th>
                                <th>Ten san pham</th>
                                <th>Phan loai</th>
                                <th>So luong</th>
                                <th>Don gia</th>
                                <th style={{ textAlign: 'right' }}>Thanh tien</th>
=======
                                <th>Mã SP</th>
                                <th>Tên sản phẩm</th>
                                <th>Phân loại</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th style={{ textAlign: 'right' }}>Thành tiền</th>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
<<<<<<< HEAD
                                <tr><td colSpan="6" className="empty-row">Khong co du lieu ban hang trong ca nay.</td></tr>
=======
                                <tr><td colSpan="6" className="empty-row">Không có dữ liệu bán hàng trong ca này.</td></tr>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                            ) : (
                                filteredProducts.map((p, i) => (
                                    <tr key={`${p.maSP}-${i}`}>
                                        <td className="font-mono">{p.maSP}</td>
                                        <td className="font-semibold">{p.tenSP}</td>
                                        <td><span className="category-pill">{p.loai}</span></td>
                                        <td>{p.soLuong}</td>
<<<<<<< HEAD
                                        <td>{p.donGia.toLocaleString()}d</td>
                                        <td style={{ textAlign: 'right' }} className="font-bold">
                                            {p.thanhTien.toLocaleString()}d
=======
                                        <td>{p.donGia.toLocaleString()}đ</td>
                                        <td style={{ textAlign: 'right' }} className="font-bold">
                                            {p.thanhTien.toLocaleString()}đ
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="ca-bottom-grid">
                <div className="note-card">
<<<<<<< HEAD
                    <div className="card-header"><FileText size={18}/> <h3>Ghi chu ban giao</h3></div>
                    <p>{ca.ghiChu || 'Khong co ghi chu phat sinh.'}</p>
                </div>
                <div className="note-card">
                    <div className="card-header"><Tag size={18}/> <h3>Chuong trinh khuyen mai</h3></div>
                    <p>{ca.khuyenMai || 'Khong co chuong trinh ap dung.'}</p>
=======
                    <div className="card-header"><FileText size={18}/> <h3>Ghi chú bàn giao</h3></div>
                    <p>{ca.ghiChu || 'Không có ghi chú phát sinh.'}</p>
                </div>
                <div className="note-card">
                    <div className="card-header"><Tag size={18}/> <h3>Chương trình khuyến mãi</h3></div>
                    <p>{ca.khuyenMai || 'Không có chương trình áp dụng.'}</p>
>>>>>>> c18f9dd6d403e3e90dd2b342a984881f2ccbafb7
                </div>
            </div>
        </div>
    );
};

export default CaDetail;
