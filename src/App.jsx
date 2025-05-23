import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import Dashboard from "./components/Dashboard";
import JobDetails from "./components/JobDetails";
import Navbar from "./components/Navbar"; // make sure this exists
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Router>
      <div className="min-h-screen bg-zinc-700 text-gray-800">
        <Navbar /> {/* Navbar visible on both states */}
        
        <AuthenticatedTemplate>
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/job/:jobId" element={<JobDetails />} />
            </Routes>
          </main>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="p-6 bg-zinc-800 shadow-xl rounded text-center">
              <h1 className="text-xl font-bold mb-4 text-gray-100">Please sign in</h1>
              <button
                onClick={handleLogin}
                className="bg-techryan-yellow text-white px-4 py-2 rounded hover:bg-techryan-yellowhover"
              >
                Sign in with Microsoft
              </button>
            </div>
          </div>
        </UnauthenticatedTemplate>
      </div>
    </Router>
  );
};

export default App;