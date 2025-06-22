export interface PokemonType {
  id: string;
  name: string;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string;
  image: string;
  power: number;
  life: number;
}

export interface Team {
  id: string;
  name: string;
  pokemon_ids: string[];
  total_power: number;
}

export interface Weakness {
  id: string;
  type1: string;
  type2: string;
  factor: number;
}

export interface BattleRound {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  life1_before: number;
  life2_before: number;
  life1_after: number;
  life2_after: number;
  damage1: number;
  damage2: number;
  type_factor1: number;
  type_factor2: number;
}

export interface BattleLog {
  team1: Team;
  team2: Team;
  rounds: BattleRound[];
  winner: string;
  team1_remaining: Pokemon[];
  team2_remaining: Pokemon[];
}
