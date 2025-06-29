import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string | null;
  height: string | null;
  weight: string | null;
  jersey_number: string | null;
  college: string | null;
  country: string | null;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  
}
export type Team = {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players : Player[]
};

const loadTeams = (): Team[] => {
  if (typeof window !== "undefined") {
    const teams = localStorage.getItem("teams");
    return teams ? JSON.parse(teams) : [];
  }
  return [];
};

const saveTeams = (teams: Team[]) => {
  localStorage.setItem("teams", JSON.stringify(teams));
};

const initialState: Team[] = loadTeams();

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    // add
    addTeam(state, action: PayloadAction<Omit<Team, "id">>) {
      if (state.some((team) => team.name === action.payload.name)) {
        throw new Error(
          `Team with name ${action.payload.name} already exists.`
        );
      }
      const newTeam = { ...action.payload, id: crypto.randomUUID() };
      state.push(newTeam);
      saveTeams(state);
    },
    // update

    updateTeam(
      state,
      action: PayloadAction<{ id: string; data: Partial<Team> }>
    ) {
      const team = state.find((team) => team.id === action.payload.id);
      if (!team) {
        throw new Error(`Team with id ${action.payload.id} not found.`);
      }
      Object.assign(team, action.payload.data);
      saveTeams(state);
    },

    deleteTeam(state, action: PayloadAction<string>) {

      const index = state.findIndex((team) => team.id === action.payload);
      if (index === -1) {
        throw new Error(`Team with id ${action.payload} not found.`);
      }

      state.splice(index, 1);
      saveTeams(state);
    },
  },
});

export const { addTeam, updateTeam, deleteTeam } = teamSlice.actions;
export default teamSlice.reducer;
