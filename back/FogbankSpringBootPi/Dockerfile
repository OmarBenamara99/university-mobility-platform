FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

# Copy the source code
COPY . .

# Make mvnw executable and build the application
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Use the built JAR with exact filename
ENTRYPOINT ["java","-jar","/target/springsecurity-0.0.1-SNAPSHOT.jar"]