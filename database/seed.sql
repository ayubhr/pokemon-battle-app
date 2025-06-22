-- Seed Data

-- Insert Pokemon Types
INSERT INTO pokemon_type (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Fire'),
  ('00000000-0000-0000-0000-000000000002', 'Water'),
  ('00000000-0000-0000-0000-000000000003', 'Grass');


-- Insert Type Effectiveness (Weakness Chart)
-- Fire vs Fire = 1.0, Fire vs Water = 0.5, Fire vs Grass = 2.0
-- Water vs Fire = 2.0, Water vs Water = 1.0, Water vs Grass = 0.5
-- Grass vs Fire = 0.5, Grass vs Water = 2.0, Grass vs Grass = 1.0
INSERT INTO weakness (type1, type2, factor) VALUES
  -- Fire attacking
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1.0), -- Fire vs Fire
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 0.5), -- Fire vs Water
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 2.0), -- Fire vs Grass
  
  -- Water attacking
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 2.0), -- Water vs Fire
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 1.0), -- Water vs Water
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 0.5), -- Water vs Grass
  
  -- Grass attacking
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 0.5), -- Grass vs Fire
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 2.0), -- Grass vs Water
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 1.0); -- Grass vs Grass


-- Insert Pokemon (5 per type = 15)


-- Fire Pokemon
INSERT INTO pokemon (name, type, image, power, life) VALUES
  ('Charmander', '00000000-0000-0000-0000-000000000001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', 65, 85),
  ('Vulpix', '00000000-0000-0000-0000-000000000001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png', 55, 75),
  ('Growlithe', '00000000-0000-0000-0000-000000000001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png', 80, 90),
  ('Ponyta', '00000000-0000-0000-0000-000000000001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png', 75, 70),
  ('Magmar', '00000000-0000-0000-0000-000000000001', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png', 95, 85);

-- Water Pokemon
INSERT INTO pokemon (name, type, image, power, life) VALUES
  ('Squirtle', '00000000-0000-0000-0000-000000000002', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', 60, 90),
  ('Psyduck', '00000000-0000-0000-0000-000000000002', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png', 50, 80),
  ('Poliwag', '00000000-0000-0000-0000-000000000002', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png', 45, 75),
  ('Tentacool', '00000000-0000-0000-0000-000000000002', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png', 70, 65),
  ('Staryu', '00000000-0000-0000-0000-000000000002', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png', 75, 70);

-- Grass Pokemon
INSERT INTO pokemon (name, type, image, power, life) VALUES
  ('Bulbasaur', '00000000-0000-0000-0000-000000000003', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 60, 85),
  ('Oddish', '00000000-0000-0000-0000-000000000003', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png', 55, 90),
  ('Bellsprout', '00000000-0000-0000-0000-000000000003', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png', 85, 60),
  ('Exeggcute', '00000000-0000-0000-0000-000000000003', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png', 50, 95),
  ('Tangela', '00000000-0000-0000-0000-000000000003', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png', 70, 85); 