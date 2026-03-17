CREATE TABLE sites (
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    name               VARCHAR(255) NOT NULL,
    address            TEXT,
    city               VARCHAR(100),
    country            VARCHAR(100) DEFAULT 'France',
    surface_m2         DECIMAL(12, 2),
    parking_spaces     INTEGER      DEFAULT 0,
    employees_count    INTEGER      DEFAULT 0,
    workstations_count INTEGER      DEFAULT 0,
    annual_energy_kwh  DECIMAL(15, 2),
    building_year      INTEGER,
    building_lifetime  INTEGER      DEFAULT 50,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sites_user_id ON sites(user_id);
CREATE INDEX idx_sites_name ON sites(name);
