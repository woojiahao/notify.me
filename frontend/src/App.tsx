import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="login" element={<Login />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
