import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ProjectPage from "./pages/ProjectPage";
import CollectionPage from "./pages/CollectionPage";
import CreateBlast from "./pages/CreateBlast";

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
      <Route
        path="/collections/:collectionId/blast/create"
        element={
          <ProtectedRoute>
            <CreateBlast />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
