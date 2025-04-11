import { create } from 'zustand'

const useModalStore = create((set) => ({
    modalType: null,
    isModalOpen: false,
    selectedNote: null,

    openModal: (type) => set({ isModalOpen: true, modalType: type }),
    closeModal: () => set({ isModalOpen: false, modalType: null, selectedNote: null }),
    setSelectedNote: (note) => set({ selectedNote: note }),
}));


export default useModalStore