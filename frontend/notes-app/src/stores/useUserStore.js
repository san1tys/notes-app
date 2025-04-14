import { create } from 'zustand';
import axiosPublic from '../utils/axiosPublic';

const useUserStore = create((set) => ({
    userInfo: null,
    isAuthenticated: false,
    isAuthLoading: true,

    setUser: (user) => set({ userInfo: user, isAuthenticated: true }),
    clearUser: () => set({ userInfo: null, isAuthenticated: false }),

    checkAuthStatus: async () => {

        set({ isAuthLoading: true });

        try {
            const response = await axiosPublic.get('/api/users/get-user', {
                withCredentials: true,
            });

            if (response.data?.user) {
                set({ userInfo: response.data.user, isAuthenticated: true });
            } else {
                set({ userInfo: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ userInfo: null, isAuthenticated: false });
        } finally {
            set({ isAuthLoading: false });
        }
    },

    logout: async () => {
        try {
            await axiosPublic.post('/api/users/logout', {}, { withCredentials: true });
        } catch (_) { }
        set({ userInfo: null, isAuthenticated: false });
    },
}));

export default useUserStore;
