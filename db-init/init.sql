-- =============================================
-- 1. SERVICE USER
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceUser')
CREATE DATABASE [ServiceUser];
GO
USE [ServiceUser]
GO
CREATE TABLE [dbo].[NhanVien](
	[maNhanVien] [varchar](20) NOT NULL PRIMARY KEY,
	[tenNhanVien] [nvarchar](100) NULL,
	[chucVu] [nvarchar](50) NULL,
	[tienLuong] [float] NULL,
	[ngayVaoLam] [date] NULL,
	[ngaySinh] [date] NULL,
	[trangThai] [nvarchar](20) DEFAULT (N'Đang làm')
);
CREATE TABLE [dbo].[TaiKhoan](
	[maTaiKhoan] [varchar](20) NOT NULL PRIMARY KEY,
	[maNhanVien] [varchar](20) NULL,
	[tenDangNhap] [varchar](255) NULL,
	[matKhau] [varchar](255) NULL,
	[loaiTaiKhoan] [nvarchar](20) NULL,
	[OTP] [int] NULL,
    CONSTRAINT [FK_TaiKhoan_NhanVien] FOREIGN KEY([maNhanVien]) REFERENCES [dbo].[NhanVien] ([maNhanVien])
);
GO


-- =============================================
-- 2. SERVICE POS (CAFE/ORDER)
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceCafe')
CREATE DATABASE [ServiceCafe];
GO
USE [ServiceCafe]
GO
CREATE TABLE [dbo].[HoaDon](
	[maHoaDon] [varchar](20) NOT NULL PRIMARY KEY,
	[maBan] [varchar](20) NULL,
	[thoiGianVao] [datetime] NULL,
	[thoiGianRa] [datetime] NULL,
	[phuongThucThanhToan] [nvarchar](20) NULL,
	[maKhuyenMai] [varchar](20) NULL,
	[tongTien] [float] NULL,
	[trangThaiThanhToan] [nvarchar](20) NULL,
	[maCa] [varchar](20) NULL
);
CREATE TABLE [dbo].[ChiTietHD](
	[maChiTietHD] [varchar](50) NOT NULL PRIMARY KEY,
	[maHoaDon] [varchar](20) NULL,
	[maSanPham] [varchar](20) NULL,
	[soLuong] [int] NULL,
	[donGia] [float] NULL,
	[ghiChu] [nvarchar](100) NULL,
    CONSTRAINT [FK_ChiTietHD_HoaDon] FOREIGN KEY([maHoaDon]) REFERENCES [dbo].[HoaDon] ([maHoaDon])
);
GO

-- =============================================
-- 3. SERVICE DOANH THU
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceDoanhThu')
CREATE DATABASE [ServiceDoanhThu];
GO
USE [ServiceDoanhThu]
GO
CREATE TABLE [dbo].[ca](
	[maCa] [varchar](50) NOT NULL PRIMARY KEY,
	[maNhanVien] [varchar](50) NOT NULL,
	[ngayThang] [date] NOT NULL,
	[soTienKet] [decimal](15, 2) DEFAULT NULL,
	[tenCa] [nvarchar](255) NOT NULL,
	[trangThai] [nvarchar](255) NOT NULL,
	[gioMoCa] [time](7) DEFAULT NULL,
	[gioDongCa] [time](7) DEFAULT NULL
);
CREATE TABLE [dbo].[doanhthu](
	[maDoanhThu] [varchar](50) NOT NULL PRIMARY KEY,
	[maCa] [varchar](50) NOT NULL,
	[tienCK] [decimal](15, 2) DEFAULT NULL,
	[tienChi] [decimal](15, 2) DEFAULT NULL,
	[tienMat] [decimal](15, 2) DEFAULT NULL,
	[tienThu] [decimal](15, 2) DEFAULT NULL
);
CREATE TABLE [dbo].[PhieuThuChi](
    [maPhieu] [varchar](20) NOT NULL PRIMARY KEY,
    [maCa] [varchar](20) NULL,
    [soTien] [float] NULL,
    [ghiChu] [nvarchar](max) NULL,
    [loaiPhieu] [nvarchar](20) NULL
);
GO


-- =============================================
-- 4. SERVICE NOTIFICATION
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceNotification')
CREATE DATABASE [ServiceNotification];
GO
USE [ServiceNotification]
GO
CREATE TABLE [dbo].[ThongBao](
	[maThongBao] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[maNhanVien] [varchar](20) NOT NULL,
	[tieuDe] [nvarchar](255) NOT NULL,
	[noiDung] [nvarchar](max) NULL,
	[loaiThongBao] [varchar](50) NOT NULL,
	[idThamChieu] [varchar](50) NULL,
	[daDoc] [bit] DEFAULT (0),
	[ngayTao] [datetime] DEFAULT (getdate())
);
GO

-- =============================================
-- 5. SERVICE PRODUCT
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceProduct')
CREATE DATABASE [ServiceProduct];
GO
USE [ServiceProduct]
GO
CREATE TABLE [dbo].[LoaiSanPham](
	[maLoaiSanPham] [varchar](20) NOT NULL PRIMARY KEY,
	[tenLoaiSanPham] [nvarchar](100) NULL,
	[duongDanHinh] [nvarchar](max) NULL
);
CREATE TABLE [dbo].[SanPham](
	[maSanPham] [varchar](20) NOT NULL PRIMARY KEY,
	[tenSanPham] [nvarchar](100) NULL,
	[donGia] [float] NULL,
	[duongDanHinh] [nvarchar](max) NULL,
	[maLoaiSanPham] [varchar](20) REFERENCES [LoaiSanPham]([maLoaiSanPham]),
	[trangThai] [nvarchar](20) NULL
);
GO
CREATE TABLE [dbo].[CongThuc](
    [maSanPham] [varchar](20) NOT NULL,
    [maNguyenLieu] [varchar](20) NOT NULL,
    [soLuong] [float] NULL,
    CONSTRAINT [PK_CongThuc] PRIMARY KEY ([maSanPham], [maNguyenLieu]),
    CONSTRAINT [FK_CongThuc_SanPham] FOREIGN KEY([maSanPham]) REFERENCES [dbo].[SanPham] ([maSanPham]) ON DELETE CASCADE
);
-- =============================================
-- 6. SERVICE PROMOTION
-- =============================================
-- Đổi chữ Serivce thành Service
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServicePromotion')
CREATE DATABASE [ServicePromotion];
GO
USE [ServicePromotion]
GO
-- Cập nhật lại tên cột cho giống thiết kế
CREATE TABLE [dbo].[KhuyenMai](
    [maKhuyenMai] [varchar](20) NOT NULL PRIMARY KEY,
    [tenKhuyenMai] [nvarchar](100) NULL,
    [moTa] [nvarchar](255) NULL,
    [loaiKhuyenMai] [varchar](255) NULL,
    [giaTri] [float] NULL,
    [trangThai] [bit] DEFAULT (1),
    [mauSac] [varchar](255) NULL,
    [ngayTao] [datetime2](7) DEFAULT (getdate())
);
-- Thêm bảng Config bị thiếu
CREATE TABLE [dbo].[KhuyenMaiConfig](
    [maKMConfig] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [maKhuyenMai] [varchar](20) NULL,
    [loaiDoiTuong] [varchar](255) NULL,
    [giaTriDonToiThieu] [decimal](18,2) NULL,
    [apDungChoLoaiSP] [varchar](255) NULL,
    CONSTRAINT [FK_KhuyenMaiConfig_KM] FOREIGN KEY([maKhuyenMai]) REFERENCES [dbo].[KhuyenMai] ([maKhuyenMai])
);
GO
-- =============================================
-- 7. SERVICE SALARY
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceSalary')
CREATE DATABASE [ServiceSalary];
GO
USE [ServiceSalary]
GO
CREATE TABLE [dbo].[ChamCong](
	[maChamCong] [varchar](20) NOT NULL PRIMARY KEY,
	[maNhanVien] [varchar](20) NULL,
	[maCa] [varchar](20) NULL,
	[thoiGianVao] [datetime] NULL,
	[thoiGianRa] [datetime] NULL,
	[soGioLam] [float] NULL,
	[trangThai] [nvarchar](20) NULL
);
CREATE TABLE [dbo].[LuongThuong](
    [maPhieu] [varchar](20) NOT NULL PRIMARY KEY,
    [maNhanVien] [varchar](20) NULL,
    [loaiPhieu] [varchar](20) NULL,
    [soTien] [float] NULL,
    [soGioLam] [float] NULL,
    [thang] [int] NULL,
    [nam] [int] NULL,
    [trangThaiLuong] [nvarchar](50) NULL,
    [ngayTao] [varchar](20) NULL,
    [ghiChu] [nvarchar](max) NULL
);
GO

-- =============================================
-- 8. SERVICE STORE
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceStore')
CREATE DATABASE [ServiceStore];
GO
USE [ServiceStore]
GO
CREATE TABLE [dbo].[NguyenLieu](
	[maNguyenLieu] [varchar](20) NOT NULL PRIMARY KEY,
	[donViTinh] [nvarchar](20) NULL,
	[soLuong] [float] NULL,
	[tenNguyenLieu] [nvarchar](100) NULL
);
GO

-- =============================================
-- 9. SERVICE BAN (TABLE)
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ServiceTable')
CREATE DATABASE [ServiceTable];
GO
USE [ServiceTable]
GO
CREATE TABLE [dbo].[KhuVuc](
	[maKhuVuc] [varchar](50) NOT NULL PRIMARY KEY,
	[tenKhuVuc] [nvarchar](255) NOT NULL,
	[trangThai] [nvarchar](255) NOT NULL
);
CREATE TABLE [dbo].[Ban](
	[maBan] [varchar](50) NOT NULL PRIMARY KEY,
	[maKhuVuc] [varchar](50) REFERENCES [KhuVuc]([maKhuVuc]),
	[trangThaiBan] [nvarchar](255) DEFAULT (N'Hoạt động'),
	[tenBan] [nvarchar](255) NOT NULL,
	[trangThaiThanhToan] [nvarchar](50) DEFAULT (N'PAID')
);
GO
INSERT [dbo].[KhuVuc] VALUES (N'TANG1', N'Tầng 1', N'Sẵn sàng')
INSERT [dbo].[Ban] VALUES (N'BAN101', N'TANG1', N'Hoạt động', N'Bàn 101', N'PENDING')
GO