import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className='flex flex-col justify-center items-center mt-20 text-center'>
            <FaExclamationTriangle className='text-red-600' size='5em' />
            <h1 className='text-4xl font-bold mt-4'>404</h1>
            <p className='text-lg text-gray-600 mb-6'>Sorry, this page does not exist</p>
            <Link to='/dashboard' className='text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-600'>
                Go Back
            </Link>
        </div>
    );
}
