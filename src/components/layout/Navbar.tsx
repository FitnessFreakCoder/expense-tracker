import React from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm py-2 px-6">
      <div className="flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-4 p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div 
            className={`${
              isSearchOpen ? 'flex w-full' : 'hidden md:flex w-64'
            } relative`}
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-1.5 pl-10 pr-4 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <div className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Search size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 md:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Search size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>
          <div className="relative group">
            <button className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                {state.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                {state.user?.name || 'User'}
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
              <button
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};