import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';
import useNotesStore from '../../stores/useNotesStore';
import useModalStore from '../../stores/useModalStore';
import useToastStore from '../../stores/useToastStore';

const NoteCard = ({ note }) => {
    const { _id, title, content, tags, isPinned, createdAt } = note;

    const { updateIsPinned, deleteNote } = useNotesStore();
    const { openModal, setSelectedNote } = useModalStore();
    const { showToast } = useToastStore();

    const handleEdit = () => {
        setSelectedNote(note);
        openModal("edit");
    };

    const handleDelete = () => {
        deleteNote(_id, showToast);
    };

    const handlePin = () => {
        updateIsPinned(note, showToast);
    };

    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{moment(createdAt).format('Do MMM YYYY')}</span>
                </div>
                <MdOutlinePushPin
                    className={`icon-btn cursor-pointer ${isPinned ? "text-primary" : "text-slate-300"
                        }`}
                    onClick={handlePin}
                />
            </div>

            <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">
                    {tags.map((item, idx) => (
                        <span key={idx}>#{item} </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <MdCreate
                        className="icon-btn hover:text-green-600 cursor-pointer"
                        onClick={handleEdit}
                    />
                    <MdDelete
                        className="icon-btn hover:text-red-500 cursor-pointer"
                        onClick={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
