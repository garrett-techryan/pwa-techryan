import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

const Navbar = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <nav className="bg-white shadow-xl p-3 flex justify-between items-center">
      {/* Left-side menu button */}
      <button className="text-gray-600 hover:text-black">
        ☰
      </button>

      {/* Center logo/title */}
      <div className="text-xl font-bold">Techryan Onsite</div>

      {/* Right-side auth button */}
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;