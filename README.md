# CarbonTrack — Hackathon #26 Capgemini

Application fullstack de calcul d'empreinte carbone pour sites physiques.

## Stack

| Couche    | Technologie                |
|-----------|----------------------------|
| Frontend  | Next.js 14 + shadcn/ui + Tailwind CSS |
| Mobile    | React Native (Expo)        |
| Backend   | Java 21 + Spring Boot 3.2  |
| BDD       | PostgreSQL 16              |
| Auth      | JWT                        |
| Migrations | Flyway                   |

## Lancement rapide (Docker)

```bash
docker-compose up --build
```

- Frontend : http://localhost:3000
- Backend API : http://localhost:8080
- Swagger UI : http://localhost:8080/swagger-ui.html

**Compte démo :** `admin@capgemini.com` / `admin123`

## Lancement local

### Backend
```bash
cd backend
# Démarrez PostgreSQL local (ou utilisez Docker)
docker run -d --name pg -e POSTGRES_DB=carbontrack -e POSTGRES_USER=carbontrack -e POSTGRES_PASSWORD=carbontrack -p 5432:5432 postgres:16-alpine

mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## Calcul CO₂

| Source | Formule |
|--------|---------|
| Construction | Σ(quantité_kg × facteur_émission) |
| Exploitation (annuel) | énergie_kWh × 0.0567 kgCO₂e/kWh |
| Total (durée de vie) | Construction + Exploitation × 50 ans |

Facteurs ADEME Base Carbone 2023.

## Données Capgemini Rennes (pré-chargées)

- Surface : 11 771 m²
- Parking : 308 places
- Énergie : 1 840 MWh/an
- Employés : 1 800
- Postes : 1 037
