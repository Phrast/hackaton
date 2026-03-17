-- Seed ADEME emission factors
-- Source: Base Carbone ADEME (https://base-empreinte.ademe.fr/)

INSERT INTO materials (name, emission_factor, unit, category, description, source) VALUES
-- Structure
('Béton armé',        0.1700, 'kg', 'STRUCTURE',  'Béton avec armature acier standard', 'ADEME Base Carbone 2023'),
('Béton précontraint',0.1900, 'kg', 'STRUCTURE',  'Béton précontraint haute performance',  'ADEME Base Carbone 2023'),
('Acier de structure', 1.4200, 'kg', 'STRUCTURE', 'Acier laminé pour charpente et poutres', 'ADEME Base Carbone 2023'),
('Bois massif',        0.0469, 'kg', 'STRUCTURE', 'Bois massif construction (résineux)', 'ADEME Base Carbone 2023'),
('Bois lamellé-collé', 0.0960, 'kg', 'STRUCTURE', 'Bois lamellé collé structure',          'ADEME Base Carbone 2023'),

-- Enveloppe
('Verre simple',       0.8500, 'kg', 'ENVELOPPE', 'Verre plat monolithique', 'ADEME Base Carbone 2023'),
('Double vitrage',     1.2800, 'kg', 'ENVELOPPE', 'Unité de vitrage isolant (UVI)',         'ADEME Base Carbone 2023'),
('Aluminium',          8.2400, 'kg', 'ENVELOPPE', 'Aluminium primaire lingots',             'ADEME Base Carbone 2023'),
('Aluminium recyclé',  1.2600, 'kg', 'ENVELOPPE', 'Aluminium issu du recyclage',            'ADEME Base Carbone 2023'),
('Polystyrène expansé',3.2900, 'kg', 'ENVELOPPE', 'PSE isolation thermique',                'ADEME Base Carbone 2023'),
('Laine de roche',     1.2800, 'kg', 'ENVELOPPE', 'Laine minérale isolation',               'ADEME Base Carbone 2023'),

-- Revêtements
('Cuivre',             3.1600, 'kg', 'REVETEMENT', 'Cuivre pour installations électriques', 'ADEME Base Carbone 2023'),
('PVC',                2.7900, 'kg', 'REVETEMENT', 'PVC pour canalisations et menuiseries',  'ADEME Base Carbone 2023'),
('Carrelage céramique',0.6700, 'kg', 'REVETEMENT', 'Carrelage céramique intérieur/extérieur','ADEME Base Carbone 2023'),
('Plâtre',             0.1200, 'kg', 'REVETEMENT', 'Plâtre pour cloisons et enduits',        'ADEME Base Carbone 2023'),

-- Parking (par unité)
('Parking sous-sol',   2800.00,'unité','PARKING',  'Empreinte construction place de parking en sous-sol', 'Estimation ADEME 2023'),
('Parking aérien',      900.00,'unité','PARKING',  'Empreinte construction place de parking aérien',      'Estimation ADEME 2023'),
('Parking sous-dalle', 1800.00,'unité','PARKING',  'Empreinte construction place de parking sous-dalle',  'Estimation ADEME 2023');
