/**
 * Utility functions for the Pokemon Battle Application
 *
 * This file contains reusable helper functions that follow TypeScript best practices
 * and help prevent code duplication across components.
 *
 * Key principles:
 * - Pure functions (no side effects)
 * - Strong typing with TypeScript
 * - Clear documentation for non-native English speakers
 * - Performance-optimized implementations
 */

import { Pokemon, TeamWithPokemon } from "@/types";

// ==================== TYPE UTILITIES ====================

/**
 * Type guard to check if a value is a non-empty string
 * Helps with TypeScript type narrowing and runtime validation
 *
 * @param value - The value to check
 * @returns true if value is a non-empty string
 * @example
 * if (isNonEmptyString(userInput)) {
 *   // TypeScript now knows userInput is string and not empty
 *   console.log(userInput.toLowerCase());
 * }
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

/**
 * Type guard to check if a value is a valid number within a range
 * Useful for validating Pokemon stats like power and life
 *
 * @param value - The value to check
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if value is a number within the specified range
 */
export const isNumberInRange = (
  value: unknown,
  min: number,
  max: number
): value is number => {
  return (
    typeof value === "number" && !isNaN(value) && value >= min && value <= max
  );
};

/**
 * Type guard to check if an array has a specific length
 * Useful for validating team compositions (must have 6 Pokemon)
 *
 * @param arr - The array to check
 * @param length - Required length
 * @returns true if array has the exact specified length
 */
export const hasExactLength = <T>(arr: unknown, length: number): arr is T[] => {
  return Array.isArray(arr) && arr.length === length;
};

// ==================== POKEMON UTILITIES ====================

/**
 * Get CSS class for Pokemon type styling
 * Returns Bootstrap color classes based on Pokemon type
 *
 * @param typeName - The Pokemon type name (case-insensitive)
 * @returns Bootstrap CSS class string
 * @example
 * const className = getPokemonTypeColor("Fire"); // Returns "bg-danger"
 */
export const getPokemonTypeColor = (typeName: string | undefined): string => {
  if (!typeName) return "bg-secondary";

  switch (typeName.toLowerCase()) {
    case "fire":
      return "bg-danger";
    case "water":
      return "bg-primary";
    case "grass":
      return "bg-success";
    default:
      return "bg-secondary";
  }
};

/**
 * Get Bootstrap icon class for Pokemon type
 * Returns appropriate icon based on Pokemon type
 *
 * @param typeName - The Pokemon type name (case-insensitive)
 * @returns Bootstrap icon class string
 */
export const getPokemonTypeIcon = (typeName: string | undefined): string => {
  if (!typeName) return "bi-question-circle";

  switch (typeName.toLowerCase()) {
    case "fire":
      return "bi-fire";
    case "water":
      return "bi-droplet-fill";
    case "grass":
      return "bi-tree-fill";
    default:
      return "bi-question-circle";
  }
};

/**
 * Calculate type distribution for a list of Pokemon
 * Returns count of each type in the Pokemon list
 *
 * @param pokemon - Array of Pokemon objects
 * @returns Object with count of each type
 * @example
 * const distribution = calculateTypeDistribution(teamPokemon);
 * console.log(`Fire Pokemon: ${distribution.fire}`);
 */
export const calculateTypeDistribution = (
  pokemon: Pokemon[] | undefined
): { fire: number; water: number; grass: number; other: number } => {
  const initialDistribution = { fire: 0, water: 0, grass: 0, other: 0 };

  if (!Array.isArray(pokemon)) {
    return initialDistribution;
  }

  return pokemon.reduce((acc, poke) => {
    const type = (poke.type_name || poke.type || "").toLowerCase();

    switch (type) {
      case "fire":
        acc.fire++;
        break;
      case "water":
        acc.water++;
        break;
      case "grass":
        acc.grass++;
        break;
      default:
        acc.other++;
    }

    return acc;
  }, initialDistribution);
};

/**
 * Calculate total life points for a team
 * Sums up all Pokemon life values safely
 *
 * @param pokemon - Array of Pokemon objects
 * @returns Total life points (0 if no valid Pokemon)
 */
export const calculateTotalLife = (pokemon: Pokemon[] | undefined): number => {
  if (!Array.isArray(pokemon)) return 0;

  return pokemon.reduce((total, poke) => {
    const life = poke.life || 0;
    return total + (typeof life === "number" ? life : 0);
  }, 0);
};

/**
 * Validate Pokemon data for form submission
 * Checks all required fields and constraints
 *
 * @param pokemon - Pokemon data to validate
 * @returns Object with validation result and error message
 */
export const validatePokemonData = (pokemon: {
  name?: string;
  type_id?: string;
  power?: number;
  life?: number;
}): { isValid: boolean; error?: string } => {
  // Check name
  if (!isNonEmptyString(pokemon.name)) {
    return {
      isValid: false,
      error: "Pokemon name is required and cannot be empty",
    };
  }

  if (pokemon.name.length > 50) {
    return {
      isValid: false,
      error: "Pokemon name cannot be longer than 50 characters",
    };
  }

  // Check type
  if (!isNonEmptyString(pokemon.type_id)) {
    return { isValid: false, error: "Pokemon type must be selected" };
  }

  // Check power
  if (!isNumberInRange(pokemon.power, 10, 100)) {
    return {
      isValid: false,
      error: "Pokemon power must be between 10 and 100",
    };
  }

  // Check life
  if (!isNumberInRange(pokemon.life, 10, 100)) {
    return { isValid: false, error: "Pokemon life must be between 10 and 100" };
  }

  return { isValid: true };
};

/**
 * Validate team data for form submission
 * Checks team name and Pokemon requirements
 *
 * @param team - Team data to validate
 * @returns Object with validation result and error message
 */
export const validateTeamData = (team: {
  name?: string;
  pokemon_ids?: string[];
}): { isValid: boolean; error?: string } => {
  // Check team name
  if (!isNonEmptyString(team.name)) {
    return {
      isValid: false,
      error: "Team name is required and cannot be empty",
    };
  }

  if (team.name.length > 100) {
    return {
      isValid: false,
      error: "Team name cannot be longer than 100 characters",
    };
  }

  // Check Pokemon IDs
  if (!hasExactLength<string>(team.pokemon_ids, 6)) {
    return { isValid: false, error: "Team must contain exactly 6 Pokemon" };
  }

  // Check all Pokemon IDs are valid strings
  const allValidIds = team.pokemon_ids.every((id) => isNonEmptyString(id));
  if (!allValidIds) {
    return { isValid: false, error: "All Pokemon IDs must be valid" };
  }

  return { isValid: true };
};

// ==================== FORMAT UTILITIES ====================

/**
 * Format a number with proper locale formatting
 * Handles undefined/null values safely
 *
 * @param value - Number to format
 * @param defaultValue - Value to return if input is invalid
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | undefined | null,
  defaultValue: number = 0
): string => {
  const numValue =
    typeof value === "number" && !isNaN(value) ? value : defaultValue;
  return numValue.toLocaleString();
};

/**
 * Truncate text to a maximum length with ellipsis
 * Useful for displaying long names in limited space
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (
  text: string | undefined,
  maxLength: number
): string => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Calculate percentage for progress bars
 * Ensures value is between 0 and 100
 *
 * @param value - Current value
 * @param max - Maximum value
 * @returns Percentage as number between 0 and 100
 */
export const calculatePercentage = (
  value: number | undefined,
  max: number
): number => {
  if (!value || typeof value !== "number" || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
};

// ==================== URL UTILITIES ====================

/**
 * Safely encode a string for use in URLs
 * Handles undefined/null values
 *
 * @param value - String to encode
 * @returns URL-encoded string or empty string if invalid
 */
export const safeEncodeURIComponent = (value: string | undefined): string => {
  if (!isNonEmptyString(value)) return "";
  return encodeURIComponent(value);
};

/**
 * Check if a URL is valid and safe
 * Basic validation for image URLs
 *
 * @param url - URL to validate
 * @returns true if URL appears to be valid
 */
export const isValidImageUrl = (url: string | undefined): boolean => {
  if (!isNonEmptyString(url)) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

// ==================== DEBOUNCE UTILITY ====================

/**
 * Debounce function to limit how often a function can be called
 * Useful for search inputs and API calls
 *
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   searchPokemon(query);
 * }, 300);
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ==================== ERROR HANDLING ====================

/**
 * Extract error message from various error types
 * Provides consistent error handling across the application
 *
 * @param error - Error object of unknown type
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Create a standardized error object
 * Useful for consistent error handling in API functions
 *
 * @param message - Error message
 * @param code - Optional error code
 * @returns Standardized error object
 */
export const createError = (message: string, code?: string) => {
  const error = new Error(message);
  if (code) {
    (error as Error & { code: string }).code = code;
  }
  return error;
};
