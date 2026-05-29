# UniConnect

A full-stack university social platform built with Node.js, Express, MongoDB, and Socket.io.

---

# Quick Start

## Prerequisites

* Docker
* Docker Compose

---

## Run the Application

```bash

docker-compose up
```

Application runs at:

```text
http://localhost:3000
```

---

# API Endpoints

## Student API

```text
GET /api/student
```

Returns:

```json
{
  "name": "Asanga Indunil",
  "studentId": "225793305"
}
```

---

## Health Check

```text
GET /health
```

---

# Test Account

```text
Email: alex.johnson@deakin.edu.au
Password: password123
```

---

# Docker Setup

The application uses:

* Node.js container
* MongoDB container
* Docker Compose
* Persistent MongoDB volume

MongoDB data persists between container restarts.

---

# Useful Commands

## Start Containers

```bash
docker-compose up --build
```

## Run in Background

```bash
docker-compose up -d
```

## View Logs

```bash
docker-compose logs -f
```

## Stop Containers

```bash
docker-compose down
```

## Remove Containers and Database Data

```bash
docker-compose down -v
```

---

# Notes

* MongoDB starts automatically
* Sample data is seeded automatically
* No manual database setup is required
* The application waits for MongoDB to become healthy before starting
