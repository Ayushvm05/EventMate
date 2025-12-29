import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the new Navbar

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* The Navbar sits at the top */}
      <Navbar />

      {/* The Page Content changes here */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
        <p>© 2026 Eventmate Project. Built for Tech Mahindra.</p>
      </footer>
    </div>
  );
};

export default MainLayout;