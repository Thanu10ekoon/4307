import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyEvents from "./pages/MyEvents";
import InvitationsPage from "./pages/InvitationsPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          user ? (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ) : (
            <Welcome />
          )
        } />
        <Route path="/myevents" element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        } />
        <Route path="/invitations" element={
          <ProtectedRoute>
            <InvitationsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
