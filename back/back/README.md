# Backend (Spring Boot)

## Prerequisites

- Java 21
- Maven 3.9+ (optional if you use the local Maven in `.tools`)
- Docker (optional, recommended to run MongoDB quickly)

## Environment

You can override runtime settings with environment variables:

- `SERVER_PORT` (default: `8080`)
- `MONGODB_URI` (default: `mongodb://localhost:27017/pfe_db`)
- `JWT_SECRET` (default value is only for local development)
- `JWT_EXPIRATION_SECONDS` (default: `86400`)

Example file: `.env.example`

## Run MongoDB (recommended)

From `back/back`:

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` with database `pfe_db`.

## Run Backend

From `back/back`:

```bash
mvn spring-boot:run
```

If `mvn` is not in your PATH, run the application from your IDE (IntelliJ/Eclipse/VS Code Java) using `BackendApplication`.
Or use the project script (PowerShell):

```powershell
.\scripts\run-backend.ps1
```

## Quick Check

1. Call `POST /api/auth/login` with:
   - email: `chef@example.com`
   - password: `password123`
2. Use returned token in `Authorization: Bearer <token>` for `/api/projects`.

## Default login

- email: `chef@example.com`
- password: `password123`
