import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-100">
          Eventmate_
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          <Link to="/events" className="hover:text-blue-200 transition">Events</Link>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;