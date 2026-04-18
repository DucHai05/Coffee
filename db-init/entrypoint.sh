#!/bin/bash

# Đợi SQL Server khởi động hoàn toàn (khoảng 20 giây)
echo "Lado Coffee: Đang đợi SQL Server khởi động..."
sleep 20s

# Chạy lệnh sqlcmd để thực thi file init.sql
# Lưu ý: Mật khẩu P phải khớp với MSSQL_SA_PASSWORD trong docker-compose.yml
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P CafePos@123456 -d master -i /usr/config/init.sql
echo "Lado Coffee: Đã khởi tạo Database thành công!"