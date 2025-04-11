import { create } from 'zustand';

const useUserStore = create((set) => ({
    userInfo: null,

    setUser: (user) => set({ userInfo: user }),

    clearUser: () => set({ userInfo: null }),
}));

export default useUserStore;
