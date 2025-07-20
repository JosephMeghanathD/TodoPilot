# TaskPilot: A Microservices To-Do List Application

![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![Maven](https://img.shields.io/badge/Build-Maven-red)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

TaskPilot is a modern, microservices-based To-Do list application designed to help users manage their tasks efficiently with features like prioritization, sub-tasks, deadlines, and categories.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
## Project Description

This project demonstrates how to build a scalable, cloud-native application using Java, Spring Boot, and a microservice architecture. It separates concerns into distinct services that communicate via APIs, making the system more resilient and easier to maintain.

## Features

-   **Task Management**: Create, read, update, and delete tasks.
-   **Sub-Tasks**: Break down complex tasks into smaller, manageable sub-tasks.
-   **Prioritization**: Assign priorities (High, Medium, Low) to tasks.
-   **Deadlines**: Set "finish by" dates for both tasks and sub-tasks.
-   **Categories**: Organize tasks with custom categories.
-   **User Management**: Secure user registration and profile management.

## Architecture

The application is composed of multiple microservices that work together.

-   **`user-service`**: Manages all user data, including registration, profiles, and authentication.
-   **`todolist-service`**: Manages all logic related to tasks, sub-tasks, and categories.
-   **(Future) API Gateway**: A single entry point for all client requests, routing traffic to the appropriate service.

## Technology Stack

-   **Backend**: Java 21, Spring Boot 3
-   **API**: Spring Web (RESTful)
-   **Data**: Spring Data JPA, Hibernate
-   **Database**: H2 (Development), PostgreSQL (Production)
-   **Build**: Apache Maven
-   **Utilities**: Lombok

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following software installed:
-   JDK 21 or later
-   Apache Maven 3.8+
-   Git
