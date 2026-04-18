import { useEffect, useState, useCallback } from "react";
// IMPORT FILE API TỔNG HỢP
import { employeeApi } from '../../api/APIGateway';
import "./employee.css";

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        maNhanVien: "",
        tenNhanVien: "",
        ngaySinh: "",
        chucVu: "Nhân Viên Bán",
        tienLuong: "",
        tenDangNhap: ""
    });

    const [selectedRowId, setSelectedRowId] = useState(null);

    // 1. Tải danh sách nhân viên - PHẢI CÓ TOKEN
    const loadEmployees = useCallback(async () => {
        try {
            const token = localStorage.getItem("token"); // Lấy "giấy thông hành"
            const res = await employeeApi.getAll(token); // Truyền token vào đây
            setEmployees(res.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu qua Gateway:", error);
            if (error.response?.status === 401) alert("Phiên đăng nhập hết hạn!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadEmployees(); }, [loadEmployees]);

    const handleRowClick = (emp) => {
        setFormData({
            maNhanVien: emp.maNhanVien,
            tenNhanVien: emp.tenNhanVien,
            ngaySinh: emp.ngaySinh || "",
            chucVu: emp.chucVu || "Nhân Viên Bán",
            tienLuong: emp.tienLuong || "",
            tenDangNhap: emp.taiKhoan ? emp.taiKhoan.tenDangNhap : ""
        });
        setSelectedRowId(emp.maNhanVien);
    };

    const handleReset = () => {
        setFormData({ maNhanVien: "", tenNhanVien: "", ngaySinh: "", chucVu: "Nhân Viên Bán", tienLuong: "", tenDangNhap: "" });
        setSelectedRowId(null);
    };

    // 2. Cập nhật nhân viên - CẦN TOKEN
    const handleUpdate = async () => {
        if (!formData.maNhanVien) return alert("Vui lòng chọn nhân viên từ bảng!");
        try {
            const token = localStorage.getItem("token");
            await employeeApi.update(formData.maNhanVien, formData, token);
            alert("Cập nhật thành công!");
            loadEmployees();
            handleReset();
        } catch { alert("Lỗi cập nhật! Kiểm tra quyền ADMIN."); }
    };

    // 3. Thêm mới nhân viên - CẦN TOKEN
    const handleAdd = async () => {
        if (!formData.tenNhanVien || !formData.tenDangNhap) {
            return alert("Vui lòng nhập đầy đủ Tên nhân viên và Email!");
        }
        try {
            const token = localStorage.getItem("token");
            await employeeApi.create(formData, token);
            alert("Thêm nhân viên thành công!");
            loadEmployees();
            handleReset();
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            alert("Lỗi: " + (error.response?.data || "Không có quyền thực hiện."));
        }
    };

    // 4. Xóa nhân viên - CẦN TOKEN
    const handleDelete = async () => {
        if (!selectedRowId) return alert("Vui lòng chọn nhân viên cần xóa!");

        const confirmDelete = window.confirm(`Xác nhận xóa nhân viên [${formData.tenNhanVien}]?`);
        if (confirmDelete) {
            try {
                const token = localStorage.getItem("token");
                await employeeApi.delete(selectedRowId, token);
                alert("Xóa thành công!");
                loadEmployees();
                handleReset();
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Lỗi: Không thể xóa qua Gateway.");
            }
        }
    };

    if (loading) return <div className="loading">Đang tải Lado Coffee...</div>;

    return (
        <div className="admin-container">
            <h2 className="main-title">QUẢN LÝ NHÂN SỰ</h2>

            <div className="info-section">
                <legend>Thông tin nhân viên</legend>
                <div className="form-grid">
                    <div className="input-group">
                        <label>Mã Nhân Viên:</label>
                        <input type="text" value={formData.maNhanVien} disabled className="readonly-input"  />
                    </div>
                    <div className="input-group">
                        <label>Tên Nhân Viên:</label>
                        <input type="text" value={formData.tenNhanVien}
                               onChange={(e) => setFormData({...formData, tenNhanVien: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Ngày Sinh:</label>
                        <input type="date" value={formData.ngaySinh}
                               onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Chức Vụ:</label>
                        <select value={formData.chucVu} onChange={(e) => setFormData({...formData, chucVu: e.target.value})}>
                            <option value="Quản lý">Quản lý</option>
                            <option value="Nhân Viên Bán">Nhân Viên Bán</option>
                            <option value="Nhân Viên Pha Chế">Nhân Viên Pha Chế</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Lương mỗi giờ:</label>
                        <input type="number" value={formData.tienLuong}
                               onChange={(e) => setFormData({...formData, tienLuong: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Email:</label>
                        <input type="email" value={formData.tenDangNhap}
                               onChange={(e) => setFormData({...formData, tenDangNhap: e.target.value})}
                               disabled={selectedRowId !== null}
                               className={selectedRowId !== null ? "readonly-input" : ""}
                               placeholder="example@gmail.com"
                        />
                    </div>
                </div>

                <div className="button-group">
                    <button className="btn-add" onClick={handleAdd}>Thêm</button>
                    <button className="btn-edit" onClick={handleUpdate}>Sửa</button>
                    <button className="btn-delete" onClick={handleDelete} >Xóa</button>
                    <button className="btn-reset" onClick={handleReset}>Làm mới</button>
                </div>
            </div>

            <div className="list-section">
                <legend>Danh sách nhân viên</legend>
                {/* Bọc bảng vào div responsive và giới hạn chiều cao nếu cần */}
                <div className="table-responsive">
                    <table className="employee-table">
                        <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Tên NV</th>
                            <th>Ngày Sinh</th>
                            <th>Chức Vụ</th>
                            <th>Lương/h</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map(emp => (
                            <tr
                                key={emp.maNhanVien}
                                onClick={() => handleRowClick(emp)}
                                className={`selectable-row ${selectedRowId === emp.maNhanVien ? 'active-row' : ''}`}
                            >
                                <td>{emp.maNhanVien}</td>
                                <td>{emp.tenNhanVien}</td>
                                <td>{emp.ngaySinh}</td>
                                <td>{emp.chucVu}</td>
                                <td className="salary-col">{emp.tienLuong?.toLocaleString()}</td>
                                <td>{emp.taiKhoan ? emp.taiKhoan.tenDangNhap : "Chưa có TK"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EmployeeManagement;