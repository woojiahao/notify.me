import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ProjectPage from "./pages/ProjectPage";
import CollectionPage from "./pages/CollectionPage";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />
      <Route
        index
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections/:collectionId"
        element={
          <ProtectedRoute>
            <CollectionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
