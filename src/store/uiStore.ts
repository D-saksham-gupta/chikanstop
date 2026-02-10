import { create } from "zustand";

interface UIStore {
  // Mobile menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Cart sidebar
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Filter sidebar (mobile)
  isFilterOpen: boolean;
  setFilterOpen: (open: boolean) => void;

  // Search modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Auth modal
  isAuthModalOpen: boolean;
  authModalView: "signin" | "signup";
  setAuthModalOpen: (open: boolean, view?: "signin" | "signup") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),

  isFilterOpen: false,
  setFilterOpen: (open) => set({ isFilterOpen: open }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  isAuthModalOpen: false,
  authModalView: "signin",
  setAuthModalOpen: (open, view = "signin") =>
    set({ isAuthModalOpen: open, authModalView: view }),
}));
