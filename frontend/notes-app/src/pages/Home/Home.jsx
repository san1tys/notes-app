import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNoteImage from '../../assets/images/add-note.svg'
import NoDataImage from '../../assets/images/no-data-icon.svg'



Modal.setAppElement('#root');

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    })

    const [notes, setNotes] = useState([])

    const [userInfo, setUserInfo] = useState(null)

    const [isSearch, setIsSearch] = useState(false)

    const navigate = useNavigate()


    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
    }

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        });
    };



    const getUserInfo = async () => {
        try {
            const res = await axiosInstance.get("/api/users/get-user")
            if (res.data && res.data.user) {
                setUserInfo(res.data.user)
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.clear()
                navigate("/login")
            }
        }
    }

    const getAllNotes = async () => {
        try {
            const res = await axiosInstance.get('/api/notes/get-all-notes')
            if (res.data && res.data.notes) {
                setNotes(res.data.notes)
            }
        } catch (err) {
            console.error(err);
        }
    }

    const deleteNote = async (data) => {
        const noteId = data._id
        try {
            const res = await axiosInstance.delete("/api/notes/delete-note/" + noteId)

            if (res.data && !res.data.error) {
                showToastMessage("Note Deleted Successfully", 'delete')
                getAllNotes()
            }

        }
        catch (err) {
            if (err.response && err.response.data & err.response.data.message) {
                console.error("An unexpected error occured.");
            }
        }
    }

    const onSearchNote = async (query) => {
        try {
            const res = await axiosInstance.get("/api/notes/search-notes", {
                params: { query }
            })

            if (res.data && res.data.notes) {
                setIsSearch(true)
                setNotes(res.data.notes)
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleClearSearch = () => {
        setIsSearch(false)
        getAllNotes()
    }

    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id;

        try {
            const response = await axiosInstance.put(
                "/api/notes/update-note-pinned/" + noteId,
                {
                    isPinned: !noteData.isPinned,
                }
            );

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getAllNotes()
        getUserInfo()
        return () => {

        }
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="container mx-auto">
                {notes.length > 0 ? (<div className="grid grid-cols-3 gap-4 mt-8">
                    {notes.map((item, idx) => (
                        <NoteCard
                            key={item._id}
                            title={item.title}
                            date={item.createdOn}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => { handleEdit(item) }}
                            onDelete={() => { deleteNote(item) }}
                            onPinNote={() => { updateIsPinned(item) }}
                        />
                    ))}
                </div>
                ) : (
                    <EmptyCard imgSrc={isSearch ? NoDataImage : AddNoteImage} message={isSearch ? "Oops! No notes found matching your search." : "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!"} />
                )}
            </div>

            <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
                onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}>
                <MdAdd className='text-[32px] text-white' />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
                contentLabel="Add/Edit Note"
                className="w-[40%] max-h-[75vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: "add", data: null })
                    }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>
            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    )
}

export default Home
