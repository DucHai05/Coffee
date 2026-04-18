FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Thay bằng dòng này, nó sẽ chỉ lấy file SNAPSHOT chuẩn
COPY build/libs/*-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]