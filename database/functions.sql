--  PostgreSQL Functions

-- Function to insert a new team with validation
CREATE OR REPLACE FUNCTION insert_team(team_name TEXT, pokemon_ids UUID[])
RETURNS UUID AS $$
DECLARE
  team_id UUID;
BEGIN
  -- Validate team length to 6 Pokemons
  IF array_length(pokemon_ids, 1) != 6 THEN
    RAISE EXCEPTION 'Team must contain exactly 6 Pokémon, got %', array_length(pokemon_ids, 1);
  END IF;
  
  -- Check all Pokemon exist in the table pokemon
  IF NOT (SELECT COUNT(*) = 6 FROM pokemon WHERE id = ANY(pokemon_ids)) THEN
    RAISE EXCEPTION 'All Pokemon IDs must reference existing Pokemon';
  END IF;
  
  -- Check for duplicates
  IF array_length(pokemon_ids, 1) != (SELECT COUNT(DISTINCT unnest) FROM unnest(pokemon_ids)) THEN
    RAISE EXCEPTION 'Team cannot contain duplicate Pokemon';
  END IF;
  
  -- Insert the team into the table team
  INSERT INTO team (name, pokemon_ids)
  VALUES (team_name, pokemon_ids)
  RETURNING id INTO team_id;
  
  RETURN team_id;
END;
$$ LANGUAGE plpgsql;


-- Function to get teams ordered desc by total power
CREATE OR REPLACE FUNCTION get_teams_by_power()
RETURNS TABLE (
  team_id UUID, 
  team_name TEXT, 
  pokemon_ids UUID[], 
  total_power NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.pokemon_ids,
    SUM(p.power) AS total_power,
    t.created_at
  FROM team t
  CROSS JOIN unnest(t.pokemon_ids) AS pid
  JOIN pokemon p ON p.id = pid
  GROUP BY t.id, t.name, t.pokemon_ids, t.created_at
  ORDER BY total_power DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;


-- Function to get team details with Pokemon info
CREATE OR REPLACE FUNCTION get_team_details(team_uuid UUID)
RETURNS TABLE (
  team_id UUID,
  team_name TEXT,
  pokemon_id UUID,
  pokemon_name TEXT,
  pokemon_type_name TEXT,
  pokemon_image TEXT,
  pokemon_power NUMERIC,
  pokemon_life NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    p.id,
    p.name,
    pt.name,
    p.image,
    p.power,
    p.life
  FROM team t
  CROSS JOIN unnest(t.pokemon_ids) AS pid
  JOIN pokemon p ON p.id = pid
  JOIN pokemon_type pt ON p.type = pt.id
  WHERE t.id = team_uuid
  ORDER BY array_position(t.pokemon_ids, p.id);
END;
$$ LANGUAGE plpgsql;

-- Function to get type effectiveness factor
CREATE OR REPLACE FUNCTION get_type_factor(attacker_type UUID, defender_type UUID)
RETURNS FLOAT AS $$
DECLARE
  effectiveness_factor FLOAT;
BEGIN
  SELECT factor INTO effectiveness_factor
  FROM weakness
  WHERE type1 = attacker_type AND type2 = defender_type;
  
  -- Default to 1.0 
  RETURN COALESCE(effectiveness_factor, 1.0);
END;
$$ LANGUAGE plpgsql;

-- Function to get Pokemon with type info
CREATE OR REPLACE FUNCTION get_pokemon_with_types()
RETURNS TABLE (
  pokemon_id UUID,
  pokemon_name TEXT,
  type_id UUID,
  type_name TEXT,
  pokemon_image TEXT,
  pokemon_power NUMERIC,
  pokemon_life NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    pt.id,
    pt.name,
    p.image,
    p.power,
    p.life
  FROM pokemon p
  JOIN pokemon_type pt ON p.type = pt.id
  ORDER BY pt.name, p.name;
END;
$$ LANGUAGE plpgsql; 