import { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNoteImage from '../../assets/images/add-note.svg';
import NoDataImage from '../../assets/images/no-data-icon.svg';

import useNotesStore from '../../stores/useNotesStore';
import useModalStore from '../../stores/useModalStore';

Modal.setAppElement('#root');

const Home = () => {
    const navigate = useNavigate();

    const {
        notes,
        userInfo,
        isSearch,
        getAllNotes,
        getUserInfo,
        searchNotes,
        clearSearch,
    } = useNotesStore();


    const {
        isModalOpen,
        modalType,
        selectedNote,
        openModal,
        closeModal,
        setSelectedNote,
    } = useModalStore();


    useEffect(() => {
        const fetchData = async () => {
            const success = await getUserInfo(navigate);
            if (success) {
                await getAllNotes();
            }
        };
        fetchData();
    }, []);

    const handleAddClick = () => {
        setSelectedNote(null);
        openModal("add");
    };

    return (
        <>
            <Navbar
                userInfo={userInfo}
                onSearchNote={searchNotes}
                handleClearSearch={clearSearch}
            />

            <div className="container mx-auto">
                {notes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {notes.map((item) => (
                            <NoteCard key={item._id} note={item} />
                        ))}
                    </div>
                ) : (
                    <EmptyCard
                        imgSrc={isSearch ? NoDataImage : AddNoteImage}
                        message={
                            isSearch
                                ? 'Oops! No notes found matching your search.'
                                : "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!"
                        }
                    />
                )}
            </div>

            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={handleAddClick}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                contentLabel="Add/Edit Note"
                className="w-[40%] max-h-[75vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
            >
                <AddEditNotes
                    onClose={closeModal}
                />
            </Modal>

            <Toast />
        </>
    );
};

export default Home;
