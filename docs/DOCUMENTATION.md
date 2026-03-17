# CarbonTrack

## Documentation Technique & Fonctionnelle

**Projet** : CarbonTrack — Calculateur d'Empreinte Carbone pour Sites Physiques
**Hackathon** : Capgemini #26
**Date** : Mars 2026
**Version** : 1.0.0

---

## Sommaire

1. [Introduction & Contexte](#1-introduction--contexte)
2. [Architecture Technique](#2-architecture-technique)
3. [Base de Données](#3-base-de-données)
4. [API REST](#4-api-rest)
5. [Frontend](#5-frontend)
6. [Méthodologie de Calcul CO₂](#6-méthodologie-de-calcul-co)
7. [Sécurité](#7-sécurité)
8. [Déploiement](#8-déploiement)
9. [Guide Utilisateur](#9-guide-utilisateur)

---

## 1. Introduction & Contexte

### 1.1 Problématique

Face à l'urgence climatique, les entreprises doivent mesurer et réduire l'empreinte carbone de leurs infrastructures physiques. Le calcul de l'impact environnemental d'un bâtiment couvre deux axes principaux :

- **L'empreinte de construction** : émissions liées aux matériaux utilisés (béton, acier, verre, etc.)
- **L'empreinte d'exploitation** : émissions liées à la consommation énergétique annuelle sur la durée de vie du bâtiment

### 1.2 Solution

**CarbonTrack** est une application web permettant de :

- Enregistrer des sites physiques avec leurs caractéristiques (surface, matériaux, consommation énergétique)
- Calculer automatiquement l'empreinte carbone selon les facteurs d'émission **ADEME Base Carbone 2023**
- Visualiser les résultats via des graphiques interactifs (répartition, historique, comparaison)
- Comparer plusieurs sites entre eux sur des indicateurs clés (CO₂ total, CO₂/m², CO₂/employé)
- Exporter un rapport PDF détaillé pour chaque site

### 1.3 Périmètre fonctionnel

| Fonctionnalité | Description |
|---|---|
| Authentification | Inscription, connexion JWT, gestion de session |
| Gestion des sites | CRUD complet avec matériaux de construction |
| Calcul CO₂ | Construction + exploitation, métriques dérivées |
| Visualisation | Graphiques pie, bar, line, radar (Recharts) |
| Comparaison | Multi-sites sur 5 indicateurs normalisés |
| Export PDF | Rapport détaillé par site (iText7) |
| Données ADEME | 29 matériaux pré-chargés avec facteurs d'émission |

---

## 2. Architecture Technique

### 2.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Navigateur)                │
│                   http://localhost:3000                  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS / REST
┌─────────────────────▼───────────────────────────────────┐
│                  Frontend (Next.js 16)                   │
│          React 19 · Tailwind CSS 4 · shadcn/ui          │
│          Recharts · Zustand · React Hook Form            │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / JSON + JWT Bearer
┌─────────────────────▼───────────────────────────────────┐
│               Backend (Spring Boot 3.2)                  │
│           Java 21 · Spring Security · Flyway             │
│           MapStruct · iText7 · SpringDoc OpenAPI         │
└─────────────────────┬───────────────────────────────────┘
                      │ JDBC
┌─────────────────────▼───────────────────────────────────┐
│                 PostgreSQL 16 (Alpine)                    │
│         5 tables · 7 migrations Flyway                   │
│         29 matériaux ADEME pré-chargés                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Stack technologique

| Couche | Technologie | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 16.1.6 |
| UI Components | shadcn/ui + Tailwind CSS | 4.x |
| Graphiques | Recharts | 3.8.0 |
| State Management | Zustand | 5.0.12 |
| Formulaires | React Hook Form + Zod | 7.x / 4.x |
| Backend | Spring Boot | 3.2.3 |
| Langage | Java (Eclipse Temurin) | 21 |
| ORM | Spring Data JPA / Hibernate | 6.x |
| Migrations | Flyway | 10.10.0 |
| Authentification | JWT (jjwt) | 0.12.5 |
| Export PDF | iText7 | 8.0.3 |
| Documentation API | SpringDoc OpenAPI | 2.3.0 |
| Base de données | PostgreSQL | 16 (Alpine) |
| Conteneurisation | Docker Compose | v5.x |

### 2.3 Structure du projet

```
hackaton/
├── docker-compose.yml
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/capgemini/carbontrack/
│       │   ├── CarbonTrackApplication.java
│       │   ├── controller/          # 4 contrôleurs REST
│       │   ├── service/             # 5 services métier
│       │   ├── model/               # 5 entités JPA
│       │   ├── dto/                 # DTOs request/response
│       │   ├── repository/          # Repositories Spring Data
│       │   ├── security/            # JWT, filtres, config
│       │   └── mapper/              # MapStruct mappers
│       └── resources/
│           ├── application.yml
│           └── db/migration/        # 7 scripts Flyway
│
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/
        ├── app/                     # Pages Next.js (App Router)
        │   ├── (auth)/              # Login, Register
        │   └── (dashboard)/         # Dashboard, Sites, Compare
        ├── components/              # Composants React
        │   ├── charts/              # 4 graphiques Recharts
        │   ├── dashboard/           # KpiCard, SiteCard
        │   ├── forms/               # SiteForm (multi-étapes)
        │   ├── layout/              # Sidebar, TopNav, AuthGuard
        │   └── ui/                  # shadcn/ui
        ├── lib/
        │   ├── api/                 # Client Axios + endpoints
        │   ├── hooks/               # useAuth (Zustand)
        │   └── utils/               # Formatters, constantes
        └── types/                   # Interfaces TypeScript
```

---

## 3. Base de Données

### 3.1 Modèle de données

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │      sites       │       │  materials   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──1:N──│ id (PK)          │       │ id (PK)      │
│ email (UQ)   │       │ user_id (FK)     │       │ name         │
│ password     │       │ name             │       │ emission_    │
│ first_name   │       │ address          │       │   factor     │
│ last_name    │       │ city             │       │ unit         │
│ role         │       │ country          │       │ category     │
│ created_at   │       │ surface_m2       │       │ description  │
└──────────────┘       │ parking_spaces   │       │ source       │
                       │ employees_count  │       └──────┬───────┘
                       │ workstations_    │              │
                       │   count          │              │
                       │ annual_energy_   │       ┌──────▼───────┐
                       │   kwh            │       │site_materials│
                       │ building_year    │       ├──────────────┤
                       │ building_        │──1:N──│ id (PK)      │
                       │   lifetime       │       │ site_id (FK) │
                       │ created_at       │       │ material_id  │
                       │ updated_at       │       │   (FK)       │
                       └────────┬─────────┘       │ quantity_kg  │
                                │                 └──────────────┘
                                │
                       ┌────────▼─────────┐
                       │ carbon_          │
                       │  calculations    │
                       ├──────────────────┤
                       │ id (PK)          │
                       │ site_id (FK)     │
                       │ construction_    │
                       │   co2_kg         │
                       │ exploitation_    │
                       │   co2_kg         │
                       │ total_co2_kg     │
                       │ co2_per_m2       │
                       │ co2_per_employee │
                       │ calculated_at    │
                       └──────────────────┘
```

### 3.2 Tables détaillées

#### `users` — Comptes utilisateurs

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Adresse email |
| password | VARCHAR(255) | NOT NULL | Hash BCrypt |
| first_name | VARCHAR(100) | | Prénom |
| last_name | VARCHAR(100) | | Nom |
| role | VARCHAR(20) | DEFAULT 'USER' | USER ou ADMIN |
| created_at | TIMESTAMP | DEFAULT NOW() | Date de création |

#### `materials` — Catalogue de matériaux ADEME

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant unique |
| name | VARCHAR(255) | NOT NULL | Nom du matériau |
| emission_factor | DECIMAL(10,4) | NOT NULL | kgCO₂e par unité |
| unit | VARCHAR(50) | NOT NULL | Unité (kg, m², m³) |
| category | VARCHAR(100) | NOT NULL | STRUCTURE, ENVELOPPE, REVETEMENT, PARKING |
| description | TEXT | | Description détaillée |
| source | VARCHAR(255) | DEFAULT 'ADEME' | Source du facteur |

**29 matériaux pré-chargés** couvrant 4 catégories :

| Catégorie | Exemples | Plage facteur (kgCO₂e/kg) |
|---|---|---|
| STRUCTURE | Béton armé, Acier, Bois lamellé-collé | 0.0469 — 1.93 |
| ENVELOPPE | Verre, Aluminium, Laine de roche | 0.85 — 8.24 |
| REVETEMENT | Peinture, Carrelage, Moquette | 0.62 — 3.19 |
| PARKING | Béton bitumineux, Enrobé | 0.0469 — 0.165 |

#### `sites` — Sites physiques

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant unique |
| user_id | BIGINT | FK → users | Propriétaire |
| name | VARCHAR(255) | NOT NULL | Nom du site |
| address | VARCHAR(500) | | Adresse postale |
| city | VARCHAR(255) | | Ville |
| country | VARCHAR(100) | DEFAULT 'France' | Pays |
| surface_m2 | DECIMAL(12,2) | | Surface en m² |
| parking_spaces | INTEGER | | Places de parking |
| employees_count | INTEGER | | Nombre d'employés |
| workstations_count | INTEGER | | Postes de travail |
| annual_energy_kwh | DECIMAL(15,2) | | Consommation annuelle (kWh) |
| building_year | INTEGER | | Année de construction |
| building_lifetime | INTEGER | DEFAULT 50 | Durée de vie (ans) |
| created_at | TIMESTAMP | DEFAULT NOW() | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW() | Dernière modification |

#### `site_materials` — Matériaux d'un site

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant unique |
| site_id | BIGINT | FK → sites, ON DELETE CASCADE | Site associé |
| material_id | BIGINT | FK → materials | Matériau utilisé |
| quantity_kg | DECIMAL(15,2) | CHECK ≥ 0 | Quantité en kg |

Contrainte : `UNIQUE(site_id, material_id)` — un matériau par site.

#### `carbon_calculations` — Historique des calculs

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant unique |
| site_id | BIGINT | FK → sites, ON DELETE CASCADE | Site calculé |
| construction_co2_kg | DECIMAL(15,2) | | CO₂ construction (kg) |
| exploitation_co2_kg | DECIMAL(15,2) | | CO₂ exploitation annuel (kg) |
| total_co2_kg | DECIMAL(15,2) | | CO₂ total sur durée de vie (kg) |
| co2_per_m2 | DECIMAL(10,2) | | CO₂ par m² (kg) |
| co2_per_employee | DECIMAL(10,2) | | CO₂ par employé (kg) |
| calculated_at | TIMESTAMP | DEFAULT NOW() | Date du calcul |

### 3.3 Migrations Flyway

| Version | Fichier | Description |
|---|---|---|
| V1 | `V1__create_users.sql` | Table des utilisateurs |
| V2 | `V2__create_materials.sql` | Catalogue des matériaux |
| V3 | `V3__create_sites.sql` | Table des sites |
| V4 | `V4__create_site_materials.sql` | Liaison sites-matériaux |
| V5 | `V5__create_carbon_calculations.sql` | Historique des calculs |
| V6 | `V6__seed_emission_factors.sql` | 29 matériaux ADEME 2023 |
| V7 | `V7__seed_capgemini_rennes.sql` | Données de démonstration |

---

## 4. API REST

**Base URL** : `http://localhost:8080`
**Documentation interactive** : `http://localhost:8080/swagger-ui.html`
**Format** : JSON
**Authentification** : Bearer Token JWT (sauf mention contraire)

### 4.1 Authentification (`/api/auth`)

> Ces endpoints sont publics (pas de JWT requis).

#### `POST /api/auth/register` — Inscription

**Request Body** :
```json
{
  "email": "utilisateur@entreprise.com",
  "password": "motdepasse123",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

**Response** `201 Created` :
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "utilisateur@entreprise.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "USER"
}
```

**Erreurs** : `400` email déjà utilisé

#### `POST /api/auth/login` — Connexion

**Request Body** :
```json
{
  "email": "utilisateur@entreprise.com",
  "password": "motdepasse123"
}
```

**Response** `200 OK` : même format que register

**Erreurs** : `401` identifiants invalides

---

### 4.2 Sites (`/api/sites`)

> Tous les endpoints nécessitent un JWT valide. Un utilisateur ne peut accéder qu'à ses propres sites.

#### `POST /api/sites` — Créer un site

**Request Body** :
```json
{
  "name": "Capgemini Rennes",
  "address": "2 Rue de Châtillon",
  "city": "Rennes",
  "country": "France",
  "surfaceM2": 11771,
  "parkingSpaces": 308,
  "employeesCount": 1800,
  "workstationsCount": 1037,
  "annualEnergyKwh": 1840000,
  "buildingYear": 2000,
  "buildingLifetime": 50,
  "materials": [
    { "materialId": 1, "quantityKg": 5000000 },
    { "materialId": 2, "quantityKg": 800000 }
  ]
}
```

**Response** `201 Created` : `SiteResponse` complet avec matériaux

#### `GET /api/sites` — Lister les sites

**Query params** : `page` (défaut 0), `size` (défaut 20), `sort` (défaut `createdAt,desc`)

**Response** `200 OK` :
```json
{
  "content": [ { /* SiteResponse */ } ],
  "totalElements": 5,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### `GET /api/sites/{id}` — Détail d'un site

**Response** `200 OK` : `SiteResponse` avec matériaux et dernier calcul

**Erreurs** : `404` site non trouvé, `403` non propriétaire

#### `PUT /api/sites/{id}` — Modifier un site

**Request Body** : même format que la création

**Response** `200 OK` : `SiteResponse` mis à jour

#### `DELETE /api/sites/{id}` — Supprimer un site

**Response** `204 No Content`

Supprime en cascade les matériaux et l'historique de calculs.

#### `POST /api/sites/{id}/calculate` — Calculer l'empreinte CO₂

**Response** `200 OK` :
```json
{
  "id": 1,
  "siteId": 1,
  "siteName": "Capgemini Rennes",
  "constructionCo2Kg": 1542350.00,
  "exploitationCo2Kg": 104328.00,
  "totalCo2Kg": 6758750.00,
  "co2PerM2": 573.97,
  "co2PerEmployee": 3754.86,
  "calculatedAt": "2026-03-17T10:30:00"
}
```

Chaque appel crée une nouvelle entrée dans l'historique.

#### `GET /api/sites/{id}/calculations` — Historique des calculs

**Response** `200 OK` : `List<CalculationResponse>` (ordre chronologique décroissant)

#### `GET /api/sites/{id}/export-pdf` — Exporter en PDF

**Response** `200 OK` : `application/pdf`

Contenu du rapport :
- Informations générales du site
- Indicateurs clés (CO₂ total, par m², par employé)
- Tableau des matériaux avec émissions individuelles
- Source des données (ADEME Base Carbone 2023)

---

### 4.3 Matériaux (`/api/materials`)

#### `GET /api/materials` — Liste des matériaux disponibles

> Endpoint public (pas de JWT requis).

**Response** `200 OK` :
```json
[
  {
    "id": 1,
    "name": "Béton armé",
    "emissionFactor": 0.165,
    "unit": "kg",
    "category": "STRUCTURE",
    "description": "Béton armé courant C25/30",
    "source": "ADEME Base Carbone 2023"
  }
]
```

Résultats triés par catégorie puis par nom.

---

### 4.4 Comparaison (`/api/compare`)

#### `GET /api/compare?siteIds=1,2,3` — Comparer des sites

**Query params** : `siteIds` — identifiants séparés par des virgules (minimum 2)

**Response** `200 OK` :
```json
{
  "sites": [
    {
      "siteId": 1,
      "siteName": "Capgemini Rennes",
      "city": "Rennes",
      "latestCalculation": {
        "constructionCo2Kg": 1542350.00,
        "exploitationCo2Kg": 104328.00,
        "totalCo2Kg": 6758750.00,
        "co2PerM2": 573.97,
        "co2PerEmployee": 3754.86
      }
    }
  ]
}
```

---

### 4.5 Résumé des endpoints

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/sites` | Oui | Créer un site |
| GET | `/api/sites` | Oui | Lister les sites (paginé) |
| GET | `/api/sites/{id}` | Oui | Détail d'un site |
| PUT | `/api/sites/{id}` | Oui | Modifier un site |
| DELETE | `/api/sites/{id}` | Oui | Supprimer un site |
| POST | `/api/sites/{id}/calculate` | Oui | Calculer CO₂ |
| GET | `/api/sites/{id}/calculations` | Oui | Historique des calculs |
| GET | `/api/sites/{id}/export-pdf` | Oui | Export PDF |
| GET | `/api/materials` | Non | Liste des matériaux |
| GET | `/api/compare?siteIds=` | Oui | Comparer des sites |

---

## 5. Frontend

### 5.1 Pages de l'application

| Route | Page | Description |
|---|---|---|
| `/` | Accueil | Redirection intelligente (login ou dashboard) |
| `/login` | Connexion | Formulaire email/mot de passe |
| `/register` | Inscription | Formulaire avec nom, email, mot de passe |
| `/sites` | Liste des sites | Recherche, grille responsive, pagination |
| `/sites/new` | Nouveau site | Formulaire multi-étapes (3 étapes) |
| `/sites/{id}` | Détail du site | KPIs, graphiques, matériaux, historique |
| `/sites/{id}/edit` | Modifier le site | Même formulaire pré-rempli |
| `/compare` | Comparaison | Sélection multi-sites, radar chart, tableau |

### 5.2 Composants principaux

#### Layout

| Composant | Description |
|---|---|
| `Sidebar` | Navigation latérale (Dashboard, Sites, Comparer), info utilisateur, déconnexion |
| `TopNav` | Barre supérieure avec titre de page contextuel et indicateur ADEME |
| `AuthGuard` | Protection des routes — vérifie l'authentification via Zustand |

#### Dashboard

| Composant | Description |
|---|---|
| `KpiCard` | Carte indicateur avec icône, valeur et sous-titre |
| `SiteCard` | Carte résumé d'un site (nom, ville, CO₂ si calculé) |

#### Graphiques (Recharts)

| Composant | Type | Données |
|---|---|---|
| `EmissionBreakdownChart` | Pie chart | Construction vs Exploitation |
| `MaterialBarChart` | Bar chart | CO₂ par matériau |
| `HistoryLineChart` | Line chart | Évolution CO₂ dans le temps |
| `ComparisonRadarChart` | Radar chart | 5 indicateurs normalisés multi-sites |

#### Formulaire de site (`SiteForm`)

Formulaire multi-étapes :
1. **Informations générales** : nom, adresse, ville, surface, année, parking
2. **Énergie & RH** : consommation kWh, employés, postes de travail
3. **Matériaux** : sélection dynamique avec quantités

### 5.3 Gestion d'état

**Zustand** (store persisté dans `localStorage`) :

```
useAuth
├── token: string | null
├── user: { email, firstName, lastName, role }
├── isAuthenticated: boolean
├── login(response) → sauvegarde token + user
└── logout() → supprime token + user
```

### 5.4 Client API (Axios)

- **Base URL** : `NEXT_PUBLIC_API_URL` ou `http://localhost:8080`
- **Intercepteur request** : ajoute `Authorization: Bearer {token}`
- **Intercepteur response** : sur `401` → logout automatique + redirection `/login`

---

## 6. Méthodologie de Calcul CO₂

### 6.1 Formules

#### Empreinte de construction

```
CO₂_construction = Σ (quantité_kg × facteur_émission)
```

Pour chaque matériau du site, on multiplie la quantité utilisée (en kg) par son facteur d'émission ADEME (en kgCO₂e/kg).

#### Empreinte d'exploitation (annuelle)

```
CO₂_exploitation_annuel = consommation_kWh × 0.0567
```

Le facteur **0.0567 kgCO₂e/kWh** correspond au mix électrique français (ADEME Base Carbone 2023).

#### Empreinte totale (sur la durée de vie)

```
CO₂_total = CO₂_construction + (CO₂_exploitation_annuel × durée_de_vie_ans)
```

La durée de vie par défaut est de **50 ans**, configurable par site.

#### Métriques dérivées

```
CO₂/m²       = CO₂_total / surface_m2
CO₂/employé  = CO₂_total / nombre_employés
```

### 6.2 Source des données

| Donnée | Source | Année |
|---|---|---|
| Facteurs d'émission des matériaux | ADEME Base Carbone | 2023 |
| Facteur électricité France | ADEME | 2023 |
| Valeur | 0.0567 kgCO₂e/kWh | — |

### 6.3 Exemple de calcul

**Site** : Capgemini Rennes (11 771 m², 1 800 employés, 1 840 MWh/an, 50 ans)

| Poste | Calcul | Résultat |
|---|---|---|
| Béton armé | 5 000 000 kg × 0.165 | 825 000 kgCO₂e |
| Acier | 800 000 kg × 1.93 | 1 544 000 kgCO₂e |
| ... | ... | ... |
| **Construction** | Σ matériaux | **~2 500 000 kgCO₂e** |
| **Exploitation/an** | 1 840 000 kWh × 0.0567 | **104 328 kgCO₂e/an** |
| **Total (50 ans)** | 2 500 000 + (104 328 × 50) | **~7 716 400 kgCO₂e** |
| CO₂/m² | 7 716 400 / 11 771 | **655 kgCO₂e/m²** |
| CO₂/employé | 7 716 400 / 1 800 | **4 287 kgCO₂e/emp.** |

---

## 7. Sécurité

### 7.1 Authentification JWT

| Paramètre | Valeur |
|---|---|
| Algorithme | HS256 (HMAC-SHA256) |
| Durée de validité | 24 heures (86 400 000 ms) |
| Stockage client | localStorage |
| Header HTTP | `Authorization: Bearer <token>` |

**Flux d'authentification** :

```
1. Client POST /api/auth/login { email, password }
2. Backend vérifie credentials (BCrypt)
3. Backend génère JWT signé avec clé secrète
4. Client stocke le token dans localStorage
5. Chaque requête inclut le token dans le header Authorization
6. Backend vérifie et décode le JWT à chaque requête protégée
```

### 7.2 Hachage des mots de passe

- Algorithme : **BCrypt** (via Spring Security `PasswordEncoder`)
- Salage automatique intégré

### 7.3 CORS

Origins autorisées (configurable via `CORS_ORIGINS`) :
- `http://localhost:3000` (frontend dev)
- `http://localhost:19006` (Expo dev)

### 7.4 Contrôle d'accès

- Chaque site est associé à un `user_id`
- Les opérations sur un site vérifient que l'utilisateur authentifié en est le propriétaire
- Rôles disponibles : `USER`, `ADMIN`

---

## 8. Déploiement

### 8.1 Docker Compose

L'application se déploie en 3 conteneurs :

```yaml
services:
  db:        # PostgreSQL 16 Alpine
  backend:   # Spring Boot (Java 21 JRE Alpine)
  frontend:  # Next.js (Node 20 Alpine)
```

**Lancement** :
```bash
docker compose up --build
```

**URLs** :

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| API Docs (JSON) | http://localhost:8080/api-docs |

### 8.2 Variables d'environnement

| Variable | Service | Défaut | Description |
|---|---|---|---|
| `DB_URL` | Backend | `jdbc:postgresql://localhost:5432/carbontrack` | URL JDBC |
| `DB_USER` | Backend | `carbontrack` | Utilisateur BDD |
| `DB_PASSWORD` | Backend | `carbontrack` | Mot de passe BDD |
| `JWT_SECRET` | Backend | (clé 256 bits par défaut) | Clé de signature JWT |
| `JWT_EXPIRATION` | Backend | `86400000` | Durée du token (ms) |
| `CORS_ORIGINS` | Backend | `http://localhost:3000` | Origins CORS autorisées |
| `PORT` | Backend | `8080` | Port du serveur |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8080` | URL de l'API backend |

### 8.3 Lancement sans Docker

**Prérequis** : Java 21, Node.js 20, PostgreSQL 16

```bash
# 1. Base de données
docker run -d --name carbontrack-db \
  -p 5432:5432 \
  -e POSTGRES_DB=carbontrack \
  -e POSTGRES_USER=carbontrack \
  -e POSTGRES_PASSWORD=carbontrack \
  postgres:16-alpine

# 2. Backend (terminal 1)
cd backend
./mvnw spring-boot:run

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

---

## 9. Guide Utilisateur

### 9.1 Première connexion

1. Accéder à `http://localhost:3000`
2. Cliquer sur **S'inscrire**
3. Renseigner email, mot de passe, nom et prénom
4. Vous êtes redirigé vers la page **Sites**

### 9.2 Ajouter un site

1. Cliquer sur **+ Nouveau site**
2. **Étape 1** — Renseigner le nom (obligatoire), adresse, ville, surface, etc.
3. **Étape 2** — Indiquer la consommation énergétique et le nombre d'employés
4. **Étape 3** — Ajouter les matériaux de construction avec leurs quantités
5. Cliquer sur **Créer le site**

### 9.3 Calculer l'empreinte carbone

1. Ouvrir la fiche d'un site
2. Cliquer sur le bouton **Calculer**
3. Les résultats s'affichent :
   - **KPIs** : CO₂ total, construction, par m², par employé
   - **Graphique pie** : répartition construction / exploitation
   - **Graphique bar** : émissions par matériau
4. Chaque calcul est sauvegardé dans l'historique

### 9.4 Comparer des sites

1. Aller dans **Comparer** via la sidebar
2. Sélectionner au moins 2 sites (seuls les sites calculés apparaissent)
3. Cliquer sur **Comparer**
4. Visualiser le graphique radar et le tableau comparatif

### 9.5 Exporter un rapport PDF

1. Ouvrir la fiche d'un site calculé
2. Cliquer sur **Exporter PDF**
3. Le rapport est téléchargé automatiquement (`rapport-{id}.pdf`)

---

*Documentation générée pour le projet CarbonTrack — Hackathon Capgemini #26 — Mars 2026*
