# TaskPilot: AI-Powered Microservices To-Do Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/3f71b2dd-f8b8-46de-b14b-d95f2134ec8a/deploy-status)](https://app.netlify.com/projects/jdtaskpilot/deploys)
<br />
![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run-orange?logo=google-cloud)
![Docker](https://img.shields.io/badge/Docker-gray?logo=docker)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

### [➡️ View Live Demo](https://jdtaskpilot.netlify.app/)

**TaskPilot** is a modern, full-stack, cloud-native To-Do list application built with a microservice architecture. It leverages Java/Spring Boot for the backend, React/TypeScript for the frontend, and integrates with Google's Gemini AI to intelligently decompose complex tasks into manageable sub-tasks.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Project Description

This project serves as a comprehensive demonstration of building a scalable, maintainable, and cloud-native application. It separates concerns into distinct backend microservices that communicate via REST APIs, all consumed by a reactive frontend client. A key feature is the integration of Google's Gemini AI, allowing users to automatically break down large tasks into smaller, actionable steps, enhancing productivity.

The application is fully containerized with Docker and deployed to Google Cloud Run, showcasing a modern DevOps workflow.

## Features

-   **👤 User Management**: Secure user registration, login, and profile management using JWT-based authentication.
-   **✅ Full CRUD Operations**: Create, read, update, and delete tasks, sub-tasks, and categories.
-   **ιε Hierarchical Tasks**: Break down complex tasks into smaller, manageable sub-tasks.
-   **✨ AI-Powered Task Decomposition**: Use Google's Gemini AI to automatically generate a list of sub-tasks from a single task description.
-   **🗂️ Categorization**: Organize tasks with custom, user-defined categories.
-   **🔝 Prioritization**: Assign priorities (High, Medium, Low) to tasks.
-   **📅 Deadlines**: Set "finish by" dates for both tasks and sub-tasks.
-   **☁️ Cloud-Native Deployment**: Containerized services deployed on Google Cloud Run for scalability and resilience.
-   **📱 Responsive UI**: A clean, modern, and responsive user interface built with React, TypeScript, and Tailwind CSS.

## Architecture
```
+-----------------+      +------------------------+      +--------------------------+
|                 |----->|      User Service      |----->|                          |
|                 |      | (Handles Auth & Users) |      |                          |
|  React Client   |      +------------------------+      |   NeonDB (PostgreSQL)    |
|   (Frontend)    |                                      |      (Shared DB)         |
|                 |      +------------------------+      |                          |
|                 |----->|   Todo List Service    |----->|                          |
|                 |      |  (Handles Tasks & AI)  |      |                          |
+-----------------+      +------------------------+      +--------------------------+
                             |
                             |
                             v
                       +------------------+
                       | Google Gemini AI |
                       +------------------+
```

-   **`frontend`**: A single-page application built with React and Vite. It communicates with the backend services via REST APIs and is deployed on Netlify.
-   **`user-service`**: Manages all user data, including registration, login (issuing JWTs), and profile management.
-   **`todolist-service`**: Manages all logic related to tasks, sub-tasks, and categories. It validates JWTs from the `user-service` to authorize requests. It also communicates with the Google Gemini API for task decomposition.
-   **`NeonDB`**: A serverless PostgreSQL database that serves as the persistent data store for both microservices.
-   **`Google Gemini`**: The external AI service used for breaking down tasks.

## Technology Stack

| Category      | Technology                                                                                                   |
|---------------|--------------------------------------------------------------------------------------------------------------|
| **Backend**   | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, Lombok                                  |
| **Frontend**  | React 18, TypeScript, Vite, Tailwind CSS, Zustand (State Management), Axios, Lucide React (Icons)             |
| **Database**  | NeonDB (Serverless PostgreSQL)                                                                               |
| **AI**        | Google Gemini Pro                                                                                            |
| **DevOps**    | Docker, Google Cloud Run, Google Artifact Registry, Google Secret Manager, Netlify (Frontend CI/CD)            |
| **Build**     | Apache Maven                                                                                                 |
| **Security**  | JWT (JSON Web Tokens)                                                                                        |

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   **Java JDK 21** or later
-   **Node.js v18+** and **npm**
-   **Apache Maven 3.8+**
-   **Docker Desktop**
-   **Git**
-   A local **PostgreSQL** instance or a cloud-based one like NeonDB.

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/TaskPilot.git
    cd TaskPilot/backend
    ```

2.  **Configure `user-service`:**
    -   Navigate to `user-service/src/main/resources/application.properties`.
    -   Update the `spring.datasource.*` properties to point to your database. Create a dedicated database for this service.
    -   Set a secure `jwt.secret`. **This secret must be identical in both microservices.**

3.  **Configure `todolist-service`:**
    -   Navigate to `todolist-service/src/main/resources/application.properties`.
    -   Update the `spring.datasource.*` properties. It can point to the same database as the user-service (JPA will manage separate tables).
    -   Ensure `jwt.secret` is the **exact same** as in the `user-service`.
    -   (Optional) To use the AI feature, provide your `GEMINI_API_KEY` and `GEMINI_PROJECT_ID`.

4.  **Run the Microservices:**
    -   Open two separate terminal windows.
    -   In the first terminal, run the `user-service`:
        ```bash
        cd user-service
        ./mvnw spring-boot:run
        ```
        The service will start on port `8081`.

    -   In the second terminal, run the `todolist-service`:
        ```bash
        cd todolist-service
        ./mvnw spring-boot:run
        ```
        The service will start on port `8082`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    # From the project root
    cd frontend/taskpilot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173`.

## Environment Variables

For production deployment (and optionally for local setup), the services are configured via environment variables. The backend `application.properties` files are set up to use these variables with local defaults.

-   `SPRING_DATASOURCE_URL`: The full JDBC URL for your PostgreSQL database.
-   `SPRING_DATASOURCE_USERNAME`: Database username.
-   `SPRING_DATASOURCE_PASSWORD`: Database password (managed as a secret in production).
-   `JWT_SECRET`: A long, secure, and random string for signing JWTs (managed as a secret).
-   `GEMINI_API_KEY`: Your API key for Google Gemini (managed as a secret).
-   `GEMINI_PROJECT_ID`: Your Google Cloud Project ID for Gemini.

## Deployment

The backend services are designed for deployment on Google Cloud Run. The `backend/deploy.sh` script automates this process.

**To deploy:**
1.  Ensure `gcloud` CLI is installed, authenticated, and configured for your project.
2.  Ensure Docker is running.
3.  Navigate to the `backend` directory.
4.  Run the script:
    ```bash
    # Deploy both services
    ./deploy.sh

    # Deploy only the user-service
    ./deploy.sh user-service
    ```
The script will:
-   Build a Docker image for the specified service(s).
-   Tag the image and push it to Google Artifact Registry.
-   Deploy the image to Google Cloud Run, injecting secrets and environment variables as configured in the script.

The frontend is deployed automatically to Netlify on pushes to the main branch.

## API Endpoints

### User Service (`/api/v1/users`)
-   `POST /register`: Create a new user account.
-   `POST /login`: Authenticate a user and receive a JWT.
-   `GET /profile`: Get the current user's profile information.
-   `PUT /profile`: Update the current user's profile.
-   `GET /health`: Health check endpoint.

### To-Do List Service (`/api/v1`)
-   `GET, POST /tasks`: Get all tasks or create a new one.
-   `GET, PUT, DELETE /tasks/{id}`: Manage a specific task.
-   `POST /tasks/{id}/toggle-complete`: Toggle a task's completion status.
-   `GET, POST /categories`: Get all categories or create a new one.
-   `DELETE /categories/{id}`: Delete a category (only if it's not in use).
-   `POST /tasks/{taskId}/subtasks`: Create a new sub-task.
-   `POST /tasks/{taskId}/subtasks/batch`: Create multiple sub-tasks at once.
-   `DELETE /tasks/{taskId}/subtasks/{subTaskId}`: Delete a sub-task.
-   `POST /ai/decompose-task`: Send a task to the Gemini AI for decomposition.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
