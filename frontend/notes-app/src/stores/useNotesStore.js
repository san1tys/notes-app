import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance'
import useUserStore from './useUserStore';

const useNotesStore = create((set, get) => ({
    notes: [],
    isSearch: false,

    getAllNotes: async () => {
        const user = useUserStore.getState().user;
        if (!user) return;

        try {
            const res = await axiosInstance.get('/api/notes/get-all-notes');
            if (res.data && res.data.notes) {
                set({ notes: res.data.notes });
            }
        } catch (err) {
            console.error(err);
        }
    },


    searchNotes: async (query) => {
        try {
            const res = await axiosInstance.get('/api/notes/search-notes', {
                params: { query },
            });
            if (res.data && res.data.notes) {
                set({ notes: res.data.notes, isSearch: true });
            }
        } catch (err) {
            console.error(err);
        }
    },

    clearSearch: () => {
        set({ isSearch: false });
        get().getAllNotes();
    },

    deleteNote: async (noteId, showToastMessage) => {
        try {
            const res = await axiosInstance.delete(`/api/notes/delete-note/${noteId}`);
            if (res.data && !res.data.error) {
                showToastMessage("Note Deleted Successfully", 'delete');
                get().getAllNotes();
            }
        } catch (err) {
            console.error(err);
        }
    },

    updateIsPinned: async (noteData, showToastMessage) => {
        const noteId = noteData._id;
        try {
            const res = await axiosInstance.put(`/api/notes/update-note-pinned/${noteId}`, {
                isPinned: !noteData.isPinned,
            });
            if (res.data && res.data.note) {
                showToastMessage("Note Updated Successfully");
                get().getAllNotes();
            }
        } catch (err) {
            console.error(err);
        }
    },

    getUserInfo: async (navigate) => {
        try {
            const res = await axiosInstance.get('/api/users/get-user');
            if (res.data && res.data.user) {
                useUserStore.getState().setUser(res.data.user);
                get().getAllNotes();
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    },
}));

export default useNotesStore;
