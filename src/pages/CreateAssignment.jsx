import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    engineerId: "",
    projectId: "",
    role: "",
    allocationPercentage: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [engRes, projRes] = await Promise.all([
          axios.get("https://engineering-resource-management-backend-2.onrender.com/api/engineers/engineers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://engineering-resource-management-backend-2.onrender.com/api/projects/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setEngineers(engRes.data);
        setProjects(projRes.data);
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    };

    fetchOptions();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://engineering-resource-management-backend-2.onrender.com/api/assignments/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/assignments");
    } catch (err) {
      setError("Failed to create assignment");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="md:flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow p-4 space-y-6">
        <h2 className="text-xl font-bold text-blue-700 text-center">Manager Panel</h2>
        <nav className="space-y-2">
          <NavLink to="/manager" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium">
            👥 Team Overview
          </NavLink>
          <NavLink to="/projects" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium">
            📦 Projects
          </NavLink>
          <NavLink to="/projects/new" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium">
            ➕ New Project
          </NavLink>
          <NavLink to="/assignments" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium">
            🔁 Assignments
          </NavLink>
          <NavLink to="/assignments/new" className="block px-4 py-2 rounded bg-blue-200 text-blue-900 font-medium">
            ➕ New Assignment
          </NavLink>
        </nav>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full text-center bg-red-100 text-red-600 py-2 rounded hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-blue-800">Create Assignment</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
            <div>
              <label className="block font-medium">Engineer</label>
              <select
                name="engineerId"
                required
                value={form.engineerId}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select engineer</option>
                {engineers.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name} ({e.skills?.join(", ")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Project</label>
              <select
                name="projectId"
                required
                value={form.projectId}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Allocation (%)</label>
              <input
                type="number"
                name="allocationPercentage"
                value={form.allocationPercentage}
                onChange={handleChange}
                required
                min={1}
                max={100}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded mt-1"
                />
              </div>

              <div className="flex-1">
                <label className="block font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Assignment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateAssignment;
