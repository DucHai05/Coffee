import React, { useEffect, useState } from 'react';
import { productApi } from '../../api/APIGateway';
import './HoaDonDetail.css';

const HoaDonDetail = ({ order, onBack }) => {
  const [productList, setProductList] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!order) {
      setProductList([]);
      return;
    }

    const detailItems = order.chiTietHDs || order.chiTiet || order.sanPham || order.items || [];

    const fetchOrderItems = async () => {
      try {
        setLoadingItems(true);
        const { data } = await productApi.getProducts();

        const productMap = new Map(
          (Array.isArray(data) ? data : []).map((product) => [product.maSanPham, product])
        );

        const normalizedItems = (Array.isArray(detailItems) ? detailItems : []).map((item) => {
          const product = productMap.get(item.maSanPham);
          const soLuong = Number(item.soLuong || 0);
          const donGia = Number(item.donGia ?? item.giaBan ?? product?.giaBan ?? 0);

          return {
            ...item,
            tenMon: product?.tenSanPham || item.tenMon || item.tenSanPham || item.maSanPham || 'San pham',
            soLuong,
            donGia,
            thanhTien: soLuong * donGia,
          };
        });

        setProductList(normalizedItems);
      } catch (error) {
        console.error('Loi tai chi tiet hoa don:', error);
        setProductList(
          (Array.isArray(detailItems) ? detailItems : []).map((item) => {
            const soLuong = Number(item.soLuong || 0);
            const donGia = Number(item.donGia ?? item.giaBan ?? 0);
            return {
              ...item,
              tenMon: item.tenMon || item.tenSanPham || item.maSanPham || 'San pham',
              soLuong,
              donGia,
              thanhTien: soLuong * donGia,
            };
          })
        );
      } finally {
        setLoadingItems(false);
      }
    };

    fetchOrderItems();
  }, [order]);

  if (!order) return <div className="receipt-container">Dang tai...</div>;

  const formatVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;

    const dd = date.getDate().toString().padStart(2, '0');
    const mo = (date.getMonth() + 1).toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');

    return `${dd}-${mo} ${hh}:${mm}:${ss}`;
  };

  const tableName = order.tenBan || order.ban || order.maBan || order.tableId || 'N/A';

  return (
    <div className="receipt-container">
      <div className="receipt-title">Chi Tiet Hoa Don</div>

      <div className="receipt-header-section">
        <div className="receipt-header-row">
          <span className="label">Ma HD:</span>
          <span className="value">{order.maHoaDon || order.id}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Ban:</span>
          <span className="value">{tableName}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Gio vao:</span>
          <span className="value">{formatTime(order.thoiGianVao || order.gioVao)}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Gio ra:</span>
          <span className="value">{formatTime(order.thoiGianRa || order.gioRa)}</span>
        </div>
      </div>

      <table className="receipt-table">
        <thead>
          <tr>
            <th width="40" className="text-center">STT</th>
            <th>Ten mon</th>
            <th className="text-center">SL</th>
            <th className="text-right">Don gia</th>
            <th className="text-right">T.Tien</th>
          </tr>
        </thead>
        <tbody>
          {loadingItems ? (
            <tr>
              <td colSpan="5" className="text-center">Dang tai danh sach mon...</td>
            </tr>
          ) : productList.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Khong co mon trong hoa don</td>
            </tr>
          ) : (
            productList.map((item, index) => (
              <tr key={item.maChiTietHD || `${item.maSanPham}-${index}`}>
                <td className="text-center">{index + 1}</td>
                <td style={{ fontWeight: 500 }}>{item.tenMon}</td>
                <td className="text-center">{item.soLuong}</td>
                <td className="text-right">{formatVND(item.donGia)}</td>
                <td className="text-right">{formatVND(item.thanhTien)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="receipt-summary-box">
        <div className="summary-row">
          <span className="label">Chiet khau:</span>
          <span className="value">{formatVND(order.chietKhau)}</span>
        </div>
        <div className="summary-row total">
          <span className="label">TONG CONG:</span>
          <span className="value">{formatVND(order.tongHoaDon || order.tongTien)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Phuong thuc:</span>
          <span className="value" style={{ fontWeight: 'bold' }}>{order.phuongThucThanhToan || 'CASH'}</span>
        </div>
      </div>

      <div className="receipt-actions">
        <button className="btn" onClick={onBack}>Quay lai</button>
        <button className="btn btn-primary" onClick={() => window.print()}>In lai hoa don</button>
      </div>
    </div>
  );
};

export default HoaDonDetail;
