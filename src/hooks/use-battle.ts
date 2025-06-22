import { useMutation } from "@tanstack/react-query";
import { BattleLog } from "@/types";

// API Functions
const simulateBattle = async (data: {
  team1_id: string;
  team2_id: string;
}): Promise<BattleLog> => {
  const response = await fetch("/api/battle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to simulate battle: ${response.statusText}`
    );
  }
  const responseData = await response.json();
  return responseData.battle;
};

// Hooks
export const useBattle = () => {
  return useMutation({
    mutationFn: simulateBattle,
    onError: (error) => {
      console.error("Failed to simulate battle:", error);
    },
  });
};
