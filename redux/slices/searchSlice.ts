import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "@/components/types/search";

const initialState : SearchState = {
    search : "",
    filter: ""
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    resetSearch: (state) => {
      state.search = "";
      state.filter = "";
    },
  },
});

export const { setSearch, setFilter, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
