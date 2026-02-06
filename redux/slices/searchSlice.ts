import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "@/components/types/search";

const initialState : SearchState = {
    search : "",
    filter: "",
    isDeleted: true,
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
    setIsDeleted: (state, action: PayloadAction<boolean>) => {
      state.isDeleted = action.payload;
    },
    resetSearch: (state) => {
      state.search = "";
      state.filter = "";
      state.isDeleted = false;
    },
  },
});

export const { setSearch, setFilter, resetSearch, setIsDeleted } = searchSlice.actions;
export default searchSlice.reducer;
