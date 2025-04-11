import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import useToastStore from "../../stores/useToastStore";

const Toast = () => {
    const { toasts } = useToastStore();

    return (
        <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
            {toasts.map(({ id, message, type }) => (
                <div
                    key={id}
                    className={`min-w-52 bg-white border shadow-2xl rounded-md relative overflow-hidden`}
                >
                    <div
                        className={`absolute left-0 top-0 h-full w-[5px] ${type === "delete" ? "bg-red-500" : "bg-green-500"}`}
                    />
                    <div className="flex items-center gap-3 py-2 px-4">
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${type === "delete" ? "bg-red-50" : "bg-green-50"}`}
                        >
                            {type === "delete" ? (
                                <MdDeleteOutline className="text-xl text-red-500" />
                            ) : (
                                <LuCheck className="text-xl text-green-500" />
                            )}
                        </div>
                        <span>{message}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
