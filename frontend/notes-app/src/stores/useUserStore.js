import { create } from 'zustand';

const useUserStore = create((set) => ({
    userInfo: null,
    isAuthenticated: false,

    setUser: (user) => set({ userInfo: user, isAuthenticated: true }),
    clearUser: () => set({ userInfo: null, isAuthenticated: false }),
}));

export default useUserStore;
