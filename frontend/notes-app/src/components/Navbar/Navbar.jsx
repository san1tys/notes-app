import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import ProfileInfo from '../Cards/ProfileInfo';
import useNotesStore from '../../stores/useNotesStore';
import useUserStore from '../../stores/useUserStore';
import axiosInstance from "../../utils/axiosInstance";

const Navbar = ({ isAuthPage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const { searchNotes, clearSearch } = useNotesStore();
    const { clearUser, userInfo } = useUserStore();

    const onLogout = async () => {
        try {
            await axiosInstance.post("/api/users/logout");
            clearUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery) {
            searchNotes(searchQuery);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const onClearSearch = () => {
        setSearchQuery('');
        clearSearch();
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim()) {
                searchNotes(searchQuery);
            } else {
                clearSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div className='flex bg-white items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

            {!isAuthPage && (
                <>
                    <SearchBar
                        value={searchQuery}
                        onChange={({ target }) => setSearchQuery(target.value)}
                        handleSearch={handleSearch}
                        onClearSearch={onClearSearch}
                        onKeyDown={handleKeyDown}
                    />
                    <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
                </>
            )}
        </div>
    );
};

export default Navbar;
