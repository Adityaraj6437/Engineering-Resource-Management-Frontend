import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SkillTags from "../components/SkillTags";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://engineering-resource-management-bac.vercel.app/api/projects/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="p-4">Loading projects...</p>;

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

      {/* Main content */}
      <main className="flex-1 bg-blue-200 p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-blue-800">Project List</h1>
          <Link
            to="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-600">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {project.name}
                  </h2>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${project.status === "active" ? "bg-green-100 text-green-700" :
                      project.status === "completed" ? "bg-gray-200 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {project.description?.slice(0, 100) || "No description"}
                </p>

                <SkillTags skills={project.requiredSkills || []} />

                <p className="text-sm text-gray-500 mt-2">
                  <strong>
                    {new Date(project.startDate).toLocaleDateString()} →{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </strong>
                </p>

                <Link
  to={`/projects/${project._id}`}
  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
>
  View Details
</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
