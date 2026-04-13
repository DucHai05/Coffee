FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Chỉ copy file đã build xong từ máy thật vào
COPY build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]