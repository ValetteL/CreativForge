import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Callback from "./pages/Auth/Callback";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditBrief from "./pages/Briefs/EditBrief";
import MyBriefs from "./pages/Briefs/MyBriefs";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/common/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/callback" element={<Callback />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-briefs" element={<PrivateRoute><MyBriefs /></PrivateRoute>} />
        <Route path="/briefs/:id/edit" element={<EditBrief />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
