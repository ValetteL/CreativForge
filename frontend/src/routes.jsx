import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Generator from "./pages/Generator/Generator";
import MyBriefs from "./pages/Briefs/MyBriefs";
import EditBrief from "./pages/Briefs/EditBrief";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound/NotFound";

// All main routes, protected/private where needed
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/my-briefs" element={
        <PrivateRoute>
          <MyBriefs />
        </PrivateRoute>
      } />
      <Route path="/briefs/:id/edit" element={
        <PrivateRoute>
          <EditBrief />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
