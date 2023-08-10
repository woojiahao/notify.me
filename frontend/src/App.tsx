import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./contexts/UserContext";
import Registration from "./pages/Registration";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
