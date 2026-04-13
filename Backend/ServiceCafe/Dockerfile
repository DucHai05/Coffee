# Sử dụng JDK 17 (khớp với bản Eclipse Adoptium ông đang dùng)
FROM eclipse-temurin:17-jdk-alpine

# Chỗ chứa file jar trong môi trường Docker
WORKDIR /app

# Copy file jar đã build (nhớ chạy ./gradlew build trước)
COPY build/libs/*.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]