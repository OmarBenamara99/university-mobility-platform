FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

# First copy the source code
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Then copy the built JAR
COPY target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]