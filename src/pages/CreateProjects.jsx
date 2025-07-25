import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreateProject = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    requiredSkills: "",
    teamSize: "",
    status: "planning",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
        teamSize: parseInt(form.teamSize),
        requiredSkills: form.requiredSkills
          .split(",")
          .map((skill) => skill.trim()),
      };

      await axios.post("https://engineering-resource-management-bac.vercel.app/api/projects/", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/projects");
    } catch (err) {
      setError("Failed to create project");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="md:flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow p-4 space-y-6">
        <h2 className="text-xl font-bold text-blue-700 text-center">Manager Panel</h2>

        <nav className="space-y-2">
          <NavLink
            to="/manager"
            className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium"
          >
            👥 Team Overview
          </NavLink>
          <NavLink
            to="/projects"
            className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium"
          >
            📦 Projects
          </NavLink>
          <NavLink
            to="/projects/new"
            className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium"
          >
            ➕ New Project
          </NavLink>
          <NavLink
            to="/assignments"
            className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium"
          >
            🔁 Assignments
          </NavLink>
          <NavLink
            to="/assignments/new"
            className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800 font-medium"
          >
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
      <main className="flex-1 bg-blue-100 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-blue-800">Create New Project</h1>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
            <div>
              <label className="block font-medium">Project Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                rows="3"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>

              <div className="flex-1">
                <label className="block font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Required Skills (comma-separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js"
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Team Size</label>
              <input
                type="number"
                name="teamSize"
                value={form.teamSize}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
                min={1}
              />
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Project
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
