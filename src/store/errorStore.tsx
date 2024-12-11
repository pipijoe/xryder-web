import { create } from "zustand";

const useErrorStore = create((set) => ({
    error: null,
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

export default useErrorStore;
