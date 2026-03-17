CREATE TABLE carbon_calculations (
    id                  BIGSERIAL PRIMARY KEY,
    site_id             BIGINT        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    construction_co2_kg DECIMAL(18, 2) NOT NULL DEFAULT 0,
    exploitation_co2_kg DECIMAL(18, 2) NOT NULL DEFAULT 0,
    total_co2_kg        DECIMAL(18, 2) NOT NULL DEFAULT 0,
    co2_per_m2          DECIMAL(12, 4),
    co2_per_employee    DECIMAL(12, 4),
    calculated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calculations_site_id ON carbon_calculations(site_id);
CREATE INDEX idx_calculations_date ON carbon_calculations(calculated_at DESC);
