export default function Spinner() {
    return (
        <div className="flex justify-center items-center mt-32">
            <div
                className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
