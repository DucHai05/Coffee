FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

# Tạo thư mục và copy file
RUN mkdir -p /usr/config
WORKDIR /usr/config
COPY entrypoint.sh /usr/config/entrypoint.sh
COPY init.sql /usr/config/init.sql

# Sửa lỗi định dạng xuống dòng (CRLF sang LF) và cấp quyền thực thi
RUN apt-get update && apt-get install -y dos2unix \
    && dos2unix /usr/config/entrypoint.sh \
    && chmod +x /usr/config/entrypoint.sh

# Chuyển lại user mssql để đảm bảo bảo mật
USER mssql

# Chạy trực tiếp script
ENTRYPOINT ["./entrypoint.sh"]