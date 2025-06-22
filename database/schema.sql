--  Database Schema


-- Pokemon Types Table
CREATE TABLE pokemon_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Pokemon Table
CREATE TABLE pokemon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type UUID REFERENCES pokemon_type(id) ON DELETE RESTRICT,
  image TEXT,
  power NUMERIC CHECK (power BETWEEN 10 AND 100) NOT NULL,
  life NUMERIC CHECK (life BETWEEN 10 AND 100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Type Weakness Table
CREATE TABLE weakness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type1 UUID REFERENCES pokemon_type(id) ON DELETE CASCADE,
  type2 UUID REFERENCES pokemon_type(id) ON DELETE CASCADE,
  factor FLOAT NOT NULL CHECK (factor > 0),
  UNIQUE(type1, type2)
);

-- Team Table
CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pokemon_ids UUID[] CHECK (array_length(pokemon_ids, 1) = 6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes 
CREATE INDEX idx_pokemon_type ON pokemon(type);
CREATE INDEX idx_weakness_type1 ON weakness(type1);
CREATE INDEX idx_weakness_type2 ON weakness(type2);
CREATE INDEX idx_team_pokemon_ids ON team USING GIN(pokemon_ids);

-- Function to validate pokemon_ids array contains existed pokemon in table pokemon
CREATE OR REPLACE FUNCTION validate_pokemon_ids()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all pokemon_ids exist in pokemon table
  IF NOT (SELECT COUNT(*) = 6 
          FROM pokemon 
          WHERE id = ANY(NEW.pokemon_ids)) THEN
    RAISE EXCEPTION 'All 6 pokemon_ids must reference existing pokemon';
  END IF;
  
  -- Check for duplicates
  IF array_length(NEW.pokemon_ids, 1) != (SELECT COUNT(DISTINCT unnest) FROM unnest(NEW.pokemon_ids)) THEN
    RAISE EXCEPTION 'Team cannot contain duplicate pokemon';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to validate team pokemon_ids
CREATE TRIGGER validate_team_pokemon_ids
  BEFORE INSERT OR UPDATE ON team
  FOR EACH ROW
  EXECUTE FUNCTION validate_pokemon_ids(); 