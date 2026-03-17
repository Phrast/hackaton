-- Seed demo user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@capgemini.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFX8/pS5RXOQZ.O',
        'Admin', 'Capgemini', 'ADMIN');
-- password: admin123

-- Seed Capgemini Rennes site
INSERT INTO sites (user_id, name, address, city, surface_m2, parking_spaces,
                   employees_count, workstations_count, annual_energy_kwh, building_year, building_lifetime)
VALUES (1, 'Capgemini Rennes', '2 Rue de Châtillon', 'Rennes',
        11771, 308, 1800, 1037, 1840000, 2000, 50);

-- Seed site materials for Capgemini Rennes (estimated from open data for 11 771 m²)
-- Béton armé: 400 kg/m² surface → ~4.7M kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 4708400
FROM materials m WHERE m.name = 'Béton armé';

-- Acier de structure: 50 kg/m² → ~588k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 588550
FROM materials m WHERE m.name = 'Acier de structure';

-- Verre simple (façades): 30 kg/m² → ~353k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 353130
FROM materials m WHERE m.name = 'Verre simple';

-- Aluminium (menuiseries): 8 kg/m² → ~94k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 94168
FROM materials m WHERE m.name = 'Aluminium';

-- Plâtre (cloisons): 20 kg/m² → ~235k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 235420
FROM materials m WHERE m.name = 'Plâtre';

-- Laine de roche (isolation): 5 kg/m² → ~58k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 58855
FROM materials m WHERE m.name = 'Laine de roche';

-- Cuivre (installations): 2 kg/m² → ~23k kg
INSERT INTO site_materials (site_id, material_id, quantity_kg)
SELECT 1, m.id, 23542
FROM materials m WHERE m.name = 'Cuivre';
