# Pokémon Battle Application

A Next.js application for managing Pokémon teams and simulating battles with type-based damage calculations.

## Features

- Display and manage Pokémon with their attributes (name, type, power, life, image)
- Create and manage teams of 6 Pokémon
- Battle simulation with type effectiveness and damage calculations
- Responsive UI built with Bootstrap 5
- Server-side rendering for optimal performance
- PostgreSQL database with Supabase integration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Bootstrap 5
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Styling**: Bootstrap 5 with Bootstrap Icons

## Prerequisites

- Node.js 18.17 or later
- PostgreSQL 15 or later
- Supabase account (for database)
- npm or yarn package manager

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ayubhr/pokemon-battle-app
   cd pokemon-battle-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following content:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:

   - Create a new Supabase project
   - Run the SQL scripts in the following order:
     1. `database/schema.sql` (creates tables and triggers)
     2. `database/functions.sql` (creates PostgreSQL functions)
     3. `database/seed.sql` (inserts initial data)

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pokemon-app/
├── database/                 # Database scripts
│   ├── functions.sql        # PostgreSQL functions
│   ├── schema.sql           # Database schema
│   └── seed.sql            # Initial data
├── public/                  # Static assets
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── api/           # API routes
│   │   ├── battle/       # Battle page
│   │   ├── pokemon/      # Pokemon management
│   │   └── teams/        # Team management
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript definitions
```

## Database Design

### Schema Design Decisions

1. **UUID Primary Keys**

   - Using UUIDs instead of serial integers for better distribution and scalability
   - Enables easier data migration and prevents ID conflicts

2. **Pokemon Types Table**

   - Separate table for types ensures data consistency
   - Enables easy addition of new types
   - Referenced by both Pokemon and Weakness tables

3. **Pokemon Table**

   - Stores basic Pokemon attributes
   - Power and life constraints (10-100) for game balance
   - Foreign key to types table
   - Timestamps for tracking creation and updates

4. **Weakness Table**

   - Implements type effectiveness matrix
   - Uses foreign keys to types table
   - Factor field for damage multiplier
   - Unique constraint on type pairs

5. **Team Table**
   - Stores team composition using UUID array
   - Enforces 6 Pokemon requirement via CHECK constraint
   - GIN index on pokemon_ids for efficient querying

### PostgreSQL Functions

1. **insert_team**

   - Validates team composition
   - Ensures all Pokemon IDs exist
   - Returns the new team's UUID

2. **get_teams_by_power**

   - Calculates total team power
   - Orders teams by power for ranking
   - Includes all relevant team information

3. **get_team_details**

   - Retrieves detailed team information
   - Joins with Pokemon and Type tables
   - Maintains Pokemon order within team

4. **get_type_factor**
   - Calculates battle damage multiplier
   - Handles type effectiveness logic
   - Returns default 1.0 if no specific rule exists

## Battle System

The battle system implements a turn-based 1v1 combat with the following rules:

1. **Type Effectiveness**

   - Fire → Grass (2.0x damage)
   - Water → Fire (2.0x damage)
   - Grass → Water (2.0x damage)
   - Same type (1.0x damage)
   - Weak against (0.5x damage)

2. **Damage Calculation**

   ```
   remaining_life = current_life - (opponent_power * type_factor)
   ```

3. **Battle Flow**
   - Teams battle one Pokemon at a time
   - Defeated Pokemon (life ≤ 0) are replaced
   - Battle continues until one team has no Pokemon left
