import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Team = {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
};

const loadTeams = () => {
  if (typeof window !== "undefined") return [];
  try {
    const storedTeams = localStorage.getItem("teams");
    return storedTeams ? JSON.parse(storedTeams) : [];
  } catch {
    return [];
  }
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
        throw new Error(`Team with name ${action.payload.name} already exists.`);
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

    //  delete
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

export const {addTeam, updateTeam, deleteTeam} = teamSlice.actions;
export default teamSlice.reducer;