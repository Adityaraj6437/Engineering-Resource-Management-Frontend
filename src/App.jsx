import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EngineerDashboard from "./pages/EngineerDashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateProject from './pages/CreateProjects';
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/register" element={<Register />} />
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Engineer */}
          <Route
            path="/"
            element={
              <ProtectedRoute role="engineer">
                <EngineerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="engineer">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Manager */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute role="manager">
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute role="manager">
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute role="manager">
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments/new"
            element={
              <ProtectedRoute role="manager">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
  path="/projects/new"
  element={
    <ProtectedRoute role="manager">
      <CreateProject />
    </ProtectedRoute>
  }
/>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App