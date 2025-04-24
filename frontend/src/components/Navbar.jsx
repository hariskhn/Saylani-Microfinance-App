import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  useEffect(() => {
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Website Name */}
        <Link to="/" className="text-xl font-bold hover:text-gray-200 transition duration-200">
          Saylani Microfinance
        </Link>

        {/* Auth & Dashboard Links */}
        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/dashboard"
              className="text-white font-bold hover:underline mr-2"
            >
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="inline-block bg-white text-blue-600 font-semibold text-md px-5 py-2 rounded-full transition duration-200 hover:scale-104"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="inline-block bg-white text-blue-600 font-semibold text-md px-5 py-2 rounded-full transition duration-200 hover:scale-104 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
