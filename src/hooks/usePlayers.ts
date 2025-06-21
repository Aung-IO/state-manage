import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/balldontlie";

async function fetchPlayers() {
  try {
    const players = await api.nba.getPlayers();
    console.log(players.data);
    return players.data;
  } catch (error) {
    console.error(error);
  }
}

export const usePlayers = ({search = '', page = 1}) => {
  return useQuery({
    queryKey: ["players", search, page],
     queryFn: async () => {
      const res = await api.nba.getPlayers({ search, page, per_page: 10 })
      return res
    },
    staleTime: 1000 * 60 * 5,
  });
};
