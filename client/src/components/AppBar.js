import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AppLogo } from "../assets/logo.svg";

function AppBar() {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const signOut = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Test Error signing out: ', error);
    }
  }

  const links = [
    { label: 'My BeatSheets', href: '/beatsheets' },
    { label: 'Sign Out', onClick: signOut },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="border-gray-800">
        <div className="flex flex-wrap items-center justify-between py-4">
          <a href="/beatsheets" className="flex items-center rtl:space-x-reverse">
            <AppLogo className="h-8" alt="App Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              BeatSheet Creator
            </span>
          </a>
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-controls="drawer-navigation"
            aria-expanded={isDrawerOpen}
            onClick={toggleDrawer}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-[#181818] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              {links.map((link) => (
                <li key={link.label}>
                  <button
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
                    onClick={link.onClick || (() => navigate(link.href))}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <div
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform bg-[#181818] w-64 shadow-xl ${isDrawerOpen ? 'translate-x-0 shadow-primary-200' : '-translate-x-full'}`}
        tabindex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
        <button
          type="button"
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={toggleDrawer}
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {links.map((link) => (
              <li key={link.label}>
                <button
                  className="flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
                  onClick={link.onClick || (() => navigate(link.href))}
                >
                  <span className="ms-3">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AppBar;
