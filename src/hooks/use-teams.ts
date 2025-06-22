import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamWithPokemon } from "@/types";

/**
 * Query key factory for Team-related queries
 * This pattern helps organize cache keys and prevents typos
 * Makes it easier to invalidate related queries
 */
export const teamKeys = {
  // Base key for all team queries
  all: ["teams"] as const,

  // Keys for team list queries (with optional filters)
  lists: () => [...teamKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...teamKeys.lists(), { filters }] as const,

  // Keys for individual team detail queries
  details: () => [...teamKeys.all, "detail"] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
} as const;

// ==================== API FUNCTIONS ====================

/**
 * Fetches all teams with their Pokemon details from the API
 * @returns Promise<TeamWithPokemon[]> - Array of team objects with Pokemon data
 * @throws Error when API request fails
 */
const fetchTeams = async (): Promise<TeamWithPokemon[]> => {
  const controller = new AbortController();

  try {
    const response = await fetch("/api/teams", {
      // Add abort signal to prevent memory leaks from pending requests
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "max-age=120", // Cache for 2 minutes (teams change more often)
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch teams: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: expected object");
    }

    // Ensure teams is an array and has proper structure
    const teams = Array.isArray(data.teams) ? data.teams : [];

    // Validate each team has required properties
    return teams.filter((team: unknown) => {
      return (
        typeof team === "object" &&
        team !== null &&
        "id" in team &&
        "name" in team &&
        "total_power" in team
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Teams fetch error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching teams");
  }
};

/**
 * Creates a new team with the given name and Pokemon
 * @param data - Object containing team name and Pokemon IDs
 * @returns Promise<TeamWithPokemon> - Created team object
 * @throws Error when creation fails
 */
const createTeam = async (data: {
  name: string;
  pokemon_ids: string[];
}): Promise<TeamWithPokemon> => {
  // Validate input parameters
  if (!data.name || typeof data.name !== "string") {
    throw new Error("Team name is required and must be a string");
  }

  if (!Array.isArray(data.pokemon_ids) || data.pokemon_ids.length !== 6) {
    throw new Error("Exactly 6 Pokemon IDs are required");
  }

  // Validate all Pokemon IDs are strings
  if (
    !data.pokemon_ids.every((id) => typeof id === "string" && id.length > 0)
  ) {
    throw new Error("All Pokemon IDs must be non-empty strings");
  }

  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name.trim(),
        pokemon_ids: data.pokemon_ids,
      }),
    });

    if (!response.ok) {
      // Try to extract error message from response
      let errorMessage = `Failed to create team: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default message
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    // Validate response structure
    if (!responseData.team) {
      throw new Error("Invalid response: missing team data");
    }

    return responseData.team;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Team creation error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while creating team");
  }
};

/**
 * Updates an existing team's information
 * @param data - Object containing team ID, new name, and new Pokemon IDs
 * @returns Promise<TeamWithPokemon> - Updated team object
 * @throws Error when update fails
 */
const updateTeam = async (data: {
  id: string;
  name: string;
  pokemon_ids: string[];
}): Promise<TeamWithPokemon> => {
  // Validate input parameters
  if (!data.id || typeof data.id !== "string") {
    throw new Error("Team ID is required and must be a string");
  }

  if (!data.name || typeof data.name !== "string") {
    throw new Error("Team name is required and must be a string");
  }

  if (!Array.isArray(data.pokemon_ids) || data.pokemon_ids.length !== 6) {
    throw new Error("Exactly 6 Pokemon IDs are required");
  }

  try {
    const response = await fetch(`/api/teams/${encodeURIComponent(data.id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name.trim(),
        pokemon_ids: data.pokemon_ids,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Failed to update team: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default message
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    if (!responseData.team) {
      throw new Error("Invalid response: missing team data");
    }

    return responseData.team;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Team update error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while updating team");
  }
};

/**
 * Deletes a team by ID
 * @param id - Team unique identifier
 * @returns Promise<{deleted_id: string}> - Confirmation object
 * @throws Error when deletion fails
 */
const deleteTeam = async (id: string): Promise<{ deleted_id: string }> => {
  // Validate input parameter
  if (!id || typeof id !== "string") {
    throw new Error("Team ID is required and must be a string");
  }

  try {
    const response = await fetch(`/api/teams/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to delete team: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default message
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return { deleted_id: responseData.deleted_id || id };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Team deletion error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while deleting team");
  }
};

// ==================== CUSTOM HOOKS ====================

/**
 * Hook to fetch all teams with their Pokemon details
 * Uses React Query for automatic caching, background updates, and loading states
 *
 * @returns Query object with teams data, loading, and error states
 * @example
 * const { data: teams, isLoading, error } = useTeams();
 */
export const useTeams = () => {
  return useQuery({
    queryKey: teamKeys.lists(),
    queryFn: fetchTeams,
    // Optimize performance settings
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes after last use
    // Teams change more often than Pokemon, so refresh more frequently
    refetchOnWindowFocus: true,
    // Retry failed requests up to 2 times
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to create a new team with optimistic updates
 * Automatically updates the cache when successful
 *
 * @returns Mutation object with mutate function and states
 * @example
 * const createTeam = useCreateTeam();
 * createTeam.mutate({ name: "Team Name", pokemon_ids: ["id1", "id2", ...] });
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,

    // Update cache when team creation is successful
    onSuccess: (newTeam) => {
      // Add the new team to the cache
      queryClient.setQueryData(
        teamKeys.lists(),
        (oldData: TeamWithPokemon[] | undefined) => {
          if (!Array.isArray(oldData)) return [newTeam];

          // Insert the new team in the correct position (sorted by power)
          const newList = [...oldData, newTeam];
          return newList.sort(
            (a, b) => (b.total_power || 0) - (a.total_power || 0)
          );
        }
      );

      // Show success message
      console.info(`Team "${newTeam.name}" created successfully`);
    },

    onError: (error) => {
      // Log error for debugging
      console.error("Failed to create team:", error);
    },

    // Always refetch to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  });
};

/**
 * Hook to update team information with optimistic updates
 * Updates cache optimistically and rolls back on error
 *
 * @returns Mutation object with mutate function and states
 * @example
 * const updateTeam = useUpdateTeam();
 * updateTeam.mutate({ id: "team-id", name: "New Name", pokemon_ids: [...] });
 */
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeam,

    // Optimistically update the cache before API call completes
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (prevents overwriting optimistic update)
      await queryClient.cancelQueries({ queryKey: teamKeys.lists() });

      // Snapshot the previous value for potential rollback
      const previousTeams = queryClient.getQueryData(teamKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        teamKeys.lists(),
        (oldData: TeamWithPokemon[] | undefined) => {
          if (!Array.isArray(oldData)) return oldData;

          return oldData.map((team) =>
            team.id === variables.id
              ? {
                  ...team,
                  name: variables.name,
                  pokemon_ids: variables.pokemon_ids,
                  // Note: total_power will be recalculated by server
                }
              : team
          );
        }
      );

      // Return context with previous values for potential rollback
      return { previousTeams };
    },

    // Update cache with real data when successful
    onSuccess: (updatedTeam) => {
      // Update the cache with the server response (includes recalculated power)
      queryClient.setQueryData(
        teamKeys.lists(),
        (oldData: TeamWithPokemon[] | undefined) => {
          if (!Array.isArray(oldData)) return [updatedTeam];

          const newList = oldData.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          );

          // Re-sort by power since power might have changed
          return newList.sort(
            (a, b) => (b.total_power || 0) - (a.total_power || 0)
          );
        }
      );

      console.info(`Team "${updatedTeam.name}" updated successfully`);
    },

    // Rollback optimistic updates if mutation fails
    onError: (error, variables, context) => {
      // Rollback the optimistic updates
      if (context?.previousTeams) {
        queryClient.setQueryData(teamKeys.lists(), context.previousTeams);
      }

      console.error("Failed to update team:", error);
    },

    // Always refetch to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  });
};

/**
 * Hook to delete a team with optimistic updates
 * Removes team from cache optimistically and rolls back on error
 *
 * @returns Mutation object with mutate function and states
 * @example
 * const deleteTeam = useDeleteTeam();
 * deleteTeam.mutate("team-id");
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,

    // Optimistically remove team from cache before API call completes
    onMutate: async (teamId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: teamKeys.lists() });

      // Snapshot the previous value for potential rollback
      const previousTeams = queryClient.getQueryData(teamKeys.lists());

      // Find the team being deleted for logging
      const teamToDelete = Array.isArray(previousTeams)
        ? previousTeams.find((team: TeamWithPokemon) => team.id === teamId)
        : null;

      // Optimistically remove the team from cache
      queryClient.setQueryData(
        teamKeys.lists(),
        (oldData: TeamWithPokemon[] | undefined) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.filter((team) => team.id !== teamId);
        }
      );

      // Return context with previous values for potential rollback
      return { previousTeams, teamToDelete };
    },

    onSuccess: (result, teamId, context) => {
      // Team already removed from cache in onMutate
      const teamName = context?.teamToDelete?.name || "Unknown";
      console.info(`Team "${teamName}" deleted successfully`);
    },

    // Rollback optimistic updates if mutation fails
    onError: (error, teamId, context) => {
      // Rollback the optimistic updates
      if (context?.previousTeams) {
        queryClient.setQueryData(teamKeys.lists(), context.previousTeams);
      }

      console.error("Failed to delete team:", error);
    },

    // Always refetch to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  });
};
