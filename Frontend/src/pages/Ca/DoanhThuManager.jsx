import React, { useEffect, useState } from 'react';
import { phieuThuChiApi, doanhthuApi } from '../../api/APIGateway';
import {
    PlusCircle,
    TrendingUp,
    TrendingDown,
    DollarSign,
    X,
    Banknote,
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react';
import './DoanhThuManager.css';

const DEFAULT_DOANH_THU = {
    tienMat: 0,
    tienCK: 0,
    tienThu: 0,
    tienChi: 0,
};

const normalizeDoanhThuPayload = (payload) => {
    const source = Array.isArray(payload) ? payload[0] : payload;
    const data = source?.data && !Array.isArray(source.data) ? source.data : source;
    return {
        tienMat: Number(data?.tienMat ?? 0),
        tienCK: Number(data?.tienCK ?? 0),
    };
};

const DoanhThuManager = ({ ca, onRefreshCa }) => {
    const [phieuThu, setPhieuThu] = useState([]);
    const [phieuChi, setPhieuChi] = useState([]);
    const [doanhThu, setDoanhThu] = useState(DEFAULT_DOANH_THU);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [phieuForm, setPhieuForm] = useState({ soTien: '', moTa: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ca?.maCa) return;
        fetchPhieu();
        fetchDoanhThu();
    }, [ca?.maCa]);

    const fetchPhieu = async () => {
        try {
            const response = await phieuThuChiApi.getByCa(ca.maCa);
            const all = response.data || [];
            const listThu = all.filter((item) => String(item.loaiPhieu || '').trim().toUpperCase() === 'THU');
            const listChi = all.filter((item) => String(item.loaiPhieu || '').trim().toUpperCase() === 'CHI');
            setPhieuThu(listThu);
            setPhieuChi(listChi);
            setDoanhThu((prev) => ({
                ...prev,
                tienThu: listThu.reduce((sum, item) => sum + Number(item.soTien || 0), 0),
                tienChi: listChi.reduce((sum, item) => sum + Number(item.soTien || 0), 0),
            }));
        } catch (error) {
            console.error('Loi khi tai phieu', error);
        }
    };

    const fetchDoanhThu = async () => {
        try {
            const { data } = await doanhthuApi.getByCa(ca.maCa);
            setDoanhThu((prev) => ({
                ...prev,
                ...normalizeDoanhThuPayload(data),
            }));
        } catch (error) {
            console.error('Loi khi tai doanh thu', error);
            setDoanhThu((prev) => ({
                ...prev,
                tienMat: 0,
                tienCK: 0,
            }));
        }
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
        setPhieuForm({ soTien: '', moTa: '' });
    };

    const handleSavePhieu = async () => {
        if (!phieuForm.soTien || !phieuForm.moTa.trim()) {
            alert('Vui long nhap day du so tien va ly do');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                soTien: parseFloat(phieuForm.soTien),
                ghiChu: phieuForm.moTa.trim(),
                maCa: ca.maCa,
                loaiPhieu: modalType === 'thu' ? 'Thu' : 'Chi'
            };

            await phieuThuChiApi.create(payload);
            await Promise.all([fetchPhieu(), fetchDoanhThu()]);
            if (onRefreshCa) await onRefreshCa();
            setModalOpen(false);
        } catch (error) {
            alert('Loi khi luu phieu. Vui long thu lai.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    return (
        <div className="doanhthu-wrapper">
            <div className="summary-cards-grid">
                <div className="summary-card">
                    <span><Banknote size={16} /> Tien mat</span>
                    <strong>{formatCurrency(doanhThu.tienMat)}</strong>
                </div>
                <div className="summary-card">
                    <span><CreditCard size={16} /> Chuyen khoan</span>
                    <strong>{formatCurrency(doanhThu.tienCK)}</strong>
                </div>
                <div className="summary-card">
                    <span><ArrowUpCircle size={16} /> Phieu thu</span>
                    <strong>{formatCurrency(doanhThu.tienThu)}</strong>
                </div>
                <div className="summary-card">
                    <span><ArrowDownCircle size={16} /> Phieu chi</span>
                    <strong>{formatCurrency(doanhThu.tienChi)}</strong>
                </div>
            </div>

            <div className="action-cards-grid">
                <div className="action-card thu" onClick={() => handleOpenModal('thu')}>
                    <div className="action-icon"><TrendingUp size={24} /></div>
                    <div className="action-info">
                        <h3>Phieu Thu</h3>
                        <p>{phieuThu.length} phieu da tao</p>
                        <span className="add-label"><PlusCircle size={14} /> Tao phieu thu</span>
                    </div>
                </div>

                <div className="action-card chi" onClick={() => handleOpenModal('chi')}>
                    <div className="action-icon"><TrendingDown size={24} /></div>
                    <div className="action-info">
                        <h3>Phieu Chi</h3>
                        <p>{phieuChi.length} phieu da tao</p>
                        <span className="add-label"><PlusCircle size={14} /> Tao phieu chi</span>
                    </div>
                </div>
            </div>

            <div className="receipt-activity-grid">
                <div className="activity-column">
                    <div className="column-header">
                        <TrendingUp size={18} color="#10b981" />
                        <h3>Lich su thu tien</h3>
                    </div>
                    <div className="activity-list">
                        {phieuThu.length === 0 ? (
                            <div className="empty-feed">Chua co khoan thu nao.</div>
                        ) : (
                            phieuThu.map((item) => (
                                <div key={item.maPhieu} className="activity-item thu">
                                    <div className="item-main">
                                        <span className="item-code">{item.maPhieu}</span>
                                        <p className="item-note">{item.ghiChu}</p>
                                    </div>
                                    <div className="item-amount">+{formatCurrency(item.soTien)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="activity-column">
                    <div className="column-header">
                        <TrendingDown size={18} color="#f43f5e" />
                        <h3>Lich su chi tien</h3>
                    </div>
                    <div className="activity-list">
                        {phieuChi.length === 0 ? (
                            <div className="empty-feed">Chua co khoan chi nao.</div>
                        ) : (
                            phieuChi.map((item) => (
                                <div key={item.maPhieu} className="activity-item chi">
                                    <div className="item-main">
                                        <span className="item-code">{item.maPhieu}</span>
                                        <p className="item-note">{item.ghiChu}</p>
                                    </div>
                                    <div className="item-amount">-{formatCurrency(item.soTien)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal-content">
                        <button className="close-x" onClick={() => setModalOpen(false)}><X size={20} /></button>

                        <div className="modal-header">
                            <div className={`modal-icon ${modalType}`}>
                                {modalType === 'thu' ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                            </div>
                            <div className="modal-header-text">
                                <h3>Lap phieu {modalType === 'thu' ? 'Thu tien' : 'Chi tien'}</h3>
                                <p>Vui long nhap chinh xac so tien va ly do thuc hien.</p>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modern-form-group">
                                <label>So tien (VND)</label>
                                <div className="input-with-symbol">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        value={phieuForm.soTien}
                                        onChange={(e) => setPhieuForm({ ...phieuForm, soTien: e.target.value })}
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="modern-form-group">
                                <label>Ly do / Ghi chu</label>
                                <textarea
                                    value={phieuForm.moTa}
                                    onChange={(e) => setPhieuForm({ ...phieuForm, moTa: e.target.value })}
                                    placeholder="Vi du: Thu tien khach no, Chi tien mua da vien..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel-ghost" onClick={() => setModalOpen(false)}>Huy bo</button>
                            <button className={`btn-submit-action ${modalType}`} onClick={handleSavePhieu} disabled={loading}>
                                {loading ? 'Dang xu ly...' : 'Xac nhan lap phieu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoanhThuManager;
