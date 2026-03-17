CREATE TABLE site_materials (
    id          BIGSERIAL PRIMARY KEY,
    site_id     BIGINT        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    material_id BIGINT        NOT NULL REFERENCES materials(id),
    quantity_kg DECIMAL(15, 2) NOT NULL CHECK (quantity_kg >= 0)
);

CREATE INDEX idx_site_materials_site_id ON site_materials(site_id);
CREATE UNIQUE INDEX idx_site_materials_unique ON site_materials(site_id, material_id);
