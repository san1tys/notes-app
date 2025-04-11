import { useState, useEffect } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import useNotesStore from '../../stores/useNotesStore'
import useToastStore from '../../stores/useToastStore'
import useModalStore from '../../stores/useModalStore'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({ onClose }) => {
    const { selectedNote, modalType } = useModalStore();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([])
    const [error, setError] = useState(null)

    const { getAllNotes } = useNotesStore()
    const { showToast } = useToastStore()

    useEffect(() => {
        if (modalType === "edit" && selectedNote) {
            setTitle(selectedNote.title || "")
            setContent(selectedNote.content || "")
            setTags(selectedNote.tags || [])
        } else {
            setTitle("")
            setContent("")
            setTags([])
        }
    }, [modalType, selectedNote])

    const addNewNote = async () => {
        try {
            const res = await axiosInstance.post("/api/notes/add-note", {
                title,
                content,
                tags
            })

            if (res.data?.note) {
                showToast("Note Added Successfully", "add")
                getAllNotes()
                onClose()
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred")
        }
    }

    const editNote = async () => {
        const noteId = selectedNote._id
        try {
            const res = await axiosInstance.put(`/api/notes/edit-note/${noteId}`, {
                title,
                content,
                tags
            })

            if (res.data?.note) {
                showToast("Note Updated Successfully", "edit")
                getAllNotes()
                onClose()
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "An error occurred")
        }
    }

    const handleAddNote = () => {
        if (!title) return setError("Please enter the title")
        if (!content) return setError("Please enter the content")

        setError(null)

        if (modalType === "edit") {
            editNote()
        } else {
            addNewNote()
        }
    }

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go To Gym At 5"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
                {modalType === "edit" ? "UPDATE" : "ADD"}
            </button>
        </div>
    )
}

export default AddEditNotes
