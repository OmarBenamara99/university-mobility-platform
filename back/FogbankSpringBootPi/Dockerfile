FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

# First copy the source code
COPY . .

# Make mvnw executable and build the application
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Then copy the built JAR
COPY target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]