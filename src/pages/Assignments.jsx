import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("https://engineering-resource-management-bac.vercel.app/api/assignments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Error loading assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

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
            className="block px-4 py-2 rounded bg-blue-200 text-blue-900 font-medium"
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
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-800">All Assignments</h1>

        {loading ? (
          <p className="text-gray-700">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-600">No assignments available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition space-y-2"
              >
                <h2 className="font-semibold text-lg text-gray-800">
                  {a.projectId?.name || "Unknown Project"}
                </h2>

                <p className="text-sm text-gray-600">
                  Engineer:{" "}
                  <span className="font-medium">
                    {a.engineerId?.name || "N/A"}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  Role: <span className="font-medium">{a.role}</span>
                </p>

                <p className="text-sm text-gray-600">
                  Allocation:{" "}
                  <span className="font-medium">{a.allocationPercentage}%</span>
                </p>

                <p className="text-sm text-gray-600">
                  Dates:{" "}
                  <span className="font-medium">
                    {new Date(a.startDate).toLocaleDateString()} →{" "}
                    {new Date(a.endDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Assignments;
