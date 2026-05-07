#!/bin/bash

# 1. Khởi động SQL Server ở chế độ nền (background)
/opt/mssql/bin/sqlservr &

# 2. Đợi SQL Server khởi động hoàn toàn
echo "Lado Coffee: Đang đợi SQL Server khởi động..."
sleep 30s

# 3. Thực thi file init.sql (Lưu ý: mssql-tools18 và thêm -C)
echo "Lado Coffee: Đang chạy script khởi tạo..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P CafePos@123456 -d master -i /usr/config/init.sql -C

echo "Lado Coffee: Đã hoàn thành script khởi tạo!"

# 4. GIỮ TIẾN TRÌNH SQL SERVER CHẠY TIẾP (Quan trọng nhất)
wait