import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  eventType: string;
  location: string;
  availableFrom: string;
  priceRange: [number, number] | [null, null];
  dateRange: [string, string] | [null, null];
}

export interface MeetingFiltersState {
  dateRange: [string, string] | [null, null];
}

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters: {
    eventType: "any",
    location: "Kyobashi",
    availableFrom: "any",
    priceRange: [null, null],
    dateRange: [null, null]
  },
  isFiltersFullOpen: false,
  viewMode: "grid",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setFilters, toggleFiltersFullOpen, setViewMode } =
  globalSlice.actions;

export default globalSlice.reducer;
