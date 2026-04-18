# Dành cho Gateway
FROM eclipse-temurin:17-jre-alpine
# Chỉ dùng dấu sao đơn giản, bỏ qua ARG JAR_FILE
COPY build/libs/ServiceAPIGateway-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]