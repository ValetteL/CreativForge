import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Generator from "./pages/Generator/Generator";
import MyBriefs from "./pages/Briefs/MyBriefs";

// Main app routing and provider structure
export default function App() {
  return (
      <AuthProvider>
        <Toaster 
          toastOptions={{
            style: { background: "var(--accent)", color: "#fff" },
            success: { style: { background: "var(--accent)", color: "#fff" } },
            error: { style: { background: "#ff5555", color: "#fff" } },
        }}/>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/my-briefs" element={
              <PrivateRoute>
                <MyBriefs />
              </PrivateRoute>
            } />
            {/* Add more routes here as needed */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}
