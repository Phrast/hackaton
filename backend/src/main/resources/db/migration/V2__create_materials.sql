CREATE TABLE materials (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    emission_factor DECIMAL(10, 4) NOT NULL,
    unit            VARCHAR(20)  NOT NULL DEFAULT 'kg',
    category        VARCHAR(50),
    description     TEXT,
    source          VARCHAR(100) DEFAULT 'ADEME Base Carbone'
);

CREATE INDEX idx_materials_category ON materials(category);
