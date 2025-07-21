# Stage 1: Build the application with Maven and a full JDK
FROM maven:3.9-eclipse-temurin-21 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to leverage Docker's layer caching
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application into a .jar file, skipping the tests
RUN mvn package -DskipTests

# Stage 2: Create the final, lightweight production image with only a JRE
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the executable .jar file from the builder stage
# Renaming it to app.jar for a consistent name
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application will run on (matches server.port in application.properties)
EXPOSE 8082

# The command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]