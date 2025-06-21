import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/balldontlie";

async function getTeams() {
  try {
    const teams = await api.nba.getTeams();
    console.log(teams.data);
    return teams.data;
  } catch (error) {
    console.error(error);
  }
}

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
};
