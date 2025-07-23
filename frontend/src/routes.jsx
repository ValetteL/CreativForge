import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Generator from "./pages/Generator/Generator";
import MyBriefs from "./pages/Briefs/MyBriefs";
import EditBrief from "./pages/Briefs/EditBrief";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound/NotFound";

// La déclaration des routes
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/my-briefs" element={
        <PrivateRoute>
          <MyBriefs />
        </PrivateRoute>
      } />
      <Route path="/briefs/:id/edit" element={<EditBrief />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
