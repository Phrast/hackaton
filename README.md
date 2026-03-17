# CarbonTrack — Hackathon #26 Capgemini

Plateforme de suivi d'empreinte carbone pour sites physiques d'entreprise.
Calcul automatique basé sur les facteurs d'émission ADEME 2023.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 + shadcn/ui + Tailwind CSS |
| Mobile | React Native (Expo) |
| Backend | Java 21 + Spring Boot 3.2 |
| BDD | PostgreSQL 16 |
| Auth | JWT |
| Video | Remotion |

## Lancement rapide (Docker)

```bash
docker-compose up --build
```

- Frontend : http://localhost:3000
- API : http://localhost:8080
- Swagger : http://localhost:8080/swagger-ui.html

**Compte demo :** `admin@capgemini.com` / `admin123`

## Lancement local

### 1. Base de donnees

```bash
docker run -d --name pg -e POSTGRES_DB=carbontrack -e POSTGRES_USER=carbontrack -e POSTGRES_PASSWORD=carbontrack -p 5432:5432 postgres:16-alpine
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

API disponible sur http://localhost:8080

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Site disponible sur http://localhost:3000

### 4. Mobile

```bash
cd mobile
npm install
npx expo start
```

Scanner le QR code avec Expo Go (iOS/Android).

## Video promotionnelle

```bash
cd video
npm install
npx remotion studio    # preview dans le navigateur
npx remotion render CarbonTrackPromo out/carbontrack-promo.mp4   # export MP4
```

## Documentation

- Documentation complete : [`docs/CarbonTrack_Documentation_Pro.pdf`](docs/CarbonTrack_Documentation_Pro%20(3).pdf)
- Documentation technique : [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)

## Structure du projet

```
backend/     API Spring Boot + Flyway migrations
frontend/    Application web Next.js
mobile/      Application mobile Expo/React Native
video/       Video promotionnelle Remotion
docs/        Documentation projet
```
