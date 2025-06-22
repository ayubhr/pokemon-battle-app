import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pokemon, PokemonType } from "@/types";

/**
 * Query key factory for Pokemon-related queries
 * This pattern helps organize cache keys and prevents typos
 * It also makes it easier to invalidate related queries
 */
export const pokemonKeys = {
  // Base key for all Pokemon queries
  all: ["pokemon"] as const,

  // Keys for Pokemon list queries (with optional filters)
  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...pokemonKeys.lists(), { filters }] as const,

  // Keys for individual Pokemon detail queries
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,

  // Key for Pokemon types (rarely changes)
  types: () => ["pokemon-types"] as const,
} as const;

/**
 * Fetches all Pokemon from the API
 * @returns Promise<Pokemon[]> - Array of Pokemon objects
 * @throws Error when API request fails
 */
const fetchPokemon = async (): Promise<Pokemon[]> => {
  const controller = new AbortController();

  try {
    const response = await fetch("/api/pokemon", {
      // Add abort signal to prevent memory leaks from pending requests
      signal: controller.signal,
      // Add headers for better caching
      headers: {
        Accept: "application/json",
        "Cache-Control": "max-age=300", // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: expected object");
    }

    return Array.isArray(data.pokemon) ? data.pokemon : [];
  } catch (error) {
    // Re-throw with more context for debugging
    if (error instanceof Error) {
      throw new Error(`Pokemon fetch error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching Pokemon");
  }
};

/**
 * Fetches a single Pokemon by ID
 * @param id - Pokemon unique identifier
 * @returns Promise<Pokemon> - Single Pokemon object
 * @throws Error when Pokemon not found or API fails
 */
const fetchPokemonById = async (id: string): Promise<Pokemon> => {
  // Validate input parameter
  if (!id || typeof id !== "string") {
    throw new Error("Pokemon ID is required and must be a string");
  }

  const controller = new AbortController();

  try {
    const response = await fetch(`/api/pokemon/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokemon with ID "${id}" not found`);
      }
      throw new Error(
        `Failed to fetch Pokemon: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Pokemon fetch error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching Pokemon");
  }
};

/**
 * Updates a Pokemon's information
 * @param params - Object containing Pokemon ID and update data
 * @returns Promise<Pokemon> - Updated Pokemon object
 * @throws Error when update fails
 */
const updatePokemon = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Pokemon>;
}): Promise<Pokemon> => {
  // Validate input parameters
  if (!id || typeof id !== "string") {
    throw new Error("Pokemon ID is required and must be a string");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Update data is required and must be an object");
  }

  // Remove undefined values to avoid sending unnecessary data
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );

  try {
    const response = await fetch(`/api/pokemon/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update Pokemon: ${response.status} ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Pokemon update error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while updating Pokemon");
  }
};

/**
 * Fetches all available Pokemon types
 * @returns Promise<PokemonType[]> - Array of Pokemon type objects
 * @throws Error when API request fails
 */
const fetchPokemonTypes = async (): Promise<PokemonType[]> => {
  try {
    const response = await fetch("/api/types", {
      headers: {
        Accept: "application/json",
        "Cache-Control": "max-age=1800", // Cache for 30 minutes (types rarely change)
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon types: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate that response is an array
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected array of types");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Pokemon types fetch error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching Pokemon types");
  }
};

// ==================== CUSTOM HOOKS ====================

/**
 * Hook to fetch all Pokemon with caching and error handling
 * Uses React Query for automatic caching, background updates, and loading states
 *
 * @returns Query object with data, loading, and error states
 * @example
 * const { data: pokemon, isLoading, error } = usePokemon();
 */
export const usePokemon = () => {
  return useQuery({
    queryKey: pokemonKeys.lists(),
    queryFn: fetchPokemon,
    // Optimize performance settings
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes after last use
    // Reduce network requests in development
    refetchOnWindowFocus: false,
    // Retry failed requests up to 2 times
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to fetch a single Pokemon by ID with caching
 * Only makes API call when ID is provided
 *
 * @param id - Pokemon unique identifier
 * @returns Query object with Pokemon data, loading, and error states
 * @example
 * const { data: pokemon, isLoading } = usePokemonById("pokemon-id");
 */
export const usePokemonById = (id: string) => {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => fetchPokemonById(id),
    // Only run query when ID is provided and valid
    enabled: Boolean(id && typeof id === "string"),
    // Individual Pokemon data is more stable
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
};

/**
 * Hook to update Pokemon information with optimistic updates
 * Automatically updates the cache when successful
 *
 * @returns Mutation object with mutate function and states
 * @example
 * const updatePokemon = useUpdatePokemon();
 * updatePokemon.mutate({ id: "pokemon-id", data: { name: "New Name" } });
 */
export const useUpdatePokemon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePokemon,

    // Optimistically update the cache before API call completes
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: pokemonKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: pokemonKeys.lists() });

      // Snapshot the previous values in case we need to rollback
      const previousPokemon = queryClient.getQueryData(pokemonKeys.detail(id));
      const previousList = queryClient.getQueryData(pokemonKeys.lists());

      // Optimistically update the individual Pokemon
      if (previousPokemon) {
        queryClient.setQueryData(pokemonKeys.detail(id), {
          ...previousPokemon,
          ...data,
        });
      }

      // Optimistically update the Pokemon list
      if (previousList && Array.isArray(previousList)) {
        queryClient.setQueryData(
          pokemonKeys.lists(),
          previousList.map((pokemon: Pokemon) =>
            pokemon.id === id ? { ...pokemon, ...data } : pokemon
          )
        );
      }

      // Return context with previous values for potential rollback
      return { previousPokemon, previousList, id };
    },

    // Update cache with real data when successful
    onSuccess: (updatedPokemon, { id }) => {
      // Update the individual Pokemon cache
      queryClient.setQueryData(pokemonKeys.detail(id), updatedPokemon);

      // Update the Pokemon list cache
      queryClient.setQueryData(
        pokemonKeys.lists(),
        (oldData: Pokemon[] | undefined) => {
          if (!Array.isArray(oldData)) return [updatedPokemon];
          return oldData.map((pokemon) =>
            pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
          );
        }
      );

      // Show success message (optional - can be handled in component)
      console.info(`Pokemon "${updatedPokemon.name}" updated successfully`);
    },

    // Rollback optimistic updates if mutation fails
    onError: (error, { id }, context) => {
      // Rollback the optimistic updates
      if (context?.previousPokemon) {
        queryClient.setQueryData(
          pokemonKeys.detail(id),
          context.previousPokemon
        );
      }
      if (context?.previousList) {
        queryClient.setQueryData(pokemonKeys.lists(), context.previousList);
      }

      // Log error for debugging
      console.error("Failed to update Pokemon:", error);
    },

    // Always refetch related queries after mutation settles
    onSettled: (_, __, { id }) => {
      // Invalidate and refetch the Pokemon list to ensure consistency
      queryClient.invalidateQueries({ queryKey: pokemonKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pokemonKeys.detail(id) });
    },
  });
};

/**
 * Hook to fetch Pokemon types with long-term caching
 * Types rarely change, so we cache them for a long time
 *
 * @returns Query object with Pokemon types data
 * @example
 * const { data: types, isLoading } = usePokemonTypes();
 */
export const usePokemonTypes = () => {
  return useQuery({
    queryKey: pokemonKeys.types(),
    queryFn: fetchPokemonTypes,
    // Types rarely change, so cache for longer
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    // Reduce unnecessary network requests
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};
