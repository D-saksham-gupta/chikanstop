import { create } from "zustand";

interface FilterStore {
  // Filter states
  selectedCategories: string[];
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: "newest" | "price-low" | "price-high" | "rating" | "popular";
  searchQuery: string;

  // Actions
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  setSelectedColors: (colors: string[]) => void;
  toggleColor: (color: string) => void;
  setSelectedSizes: (sizes: string[]) => void;
  toggleSize: (size: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (
    sort: "newest" | "price-low" | "price-high" | "rating" | "popular",
  ) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // Initial states
  selectedCategories: [],
  selectedColors: [],
  selectedSizes: [],
  priceRange: [0, 10000],
  minRating: 0,
  sortBy: "newest",
  searchQuery: "",

  // Actions
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),

  toggleCategory: (category) => {
    const current = get().selectedCategories;
    set({
      selectedCategories: current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    });
  },

  setSelectedColors: (colors) => set({ selectedColors: colors }),

  toggleColor: (color) => {
    const current = get().selectedColors;
    set({
      selectedColors: current.includes(color)
        ? current.filter((c) => c !== color)
        : [...current, color],
    });
  },

  setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),

  toggleSize: (size) => {
    const current = get().selectedSizes;
    set({
      selectedSizes: current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size],
    });
  },

  setPriceRange: (range) => set({ priceRange: range }),

  setMinRating: (rating) => set({ minRating: rating }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  clearFilters: () =>
    set({
      selectedCategories: [],
      selectedColors: [],
      selectedSizes: [],
      priceRange: [0, 10000],
      minRating: 0,
      sortBy: "newest",
      searchQuery: "",
    }),
}));
