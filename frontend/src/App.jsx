import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes";

// Root component: wraps everything in AuthProvider and Router
export default function App() {
  return (
    <AuthProvider>
      <Toaster
        toastOptions={{
          style: { background: "var(--accent)", color: "#fff" },
          success: { background: "var(--accent)", color: "#fff" },
          error: { background: "#ff5555", color: "#fff" },
        }}
      />
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
