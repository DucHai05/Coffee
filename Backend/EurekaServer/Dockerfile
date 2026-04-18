FROM eclipse-temurin:17-jre-alpine
# Copy đích danh file JAR để tránh lỗi wildcard
COPY build/libs/EurekaServer-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app.jar"]