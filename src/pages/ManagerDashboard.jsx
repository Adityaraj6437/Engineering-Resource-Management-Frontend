import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import CapacityBar from "../components/CapacityBar";
import SkillTags from "../components/SkillTags";
import { useAuth } from "../context/AuthContext";

const ManagerDashboard = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get("https://engineering-resource-management-backend-2.onrender.com/api/engineers/engineers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enriched = await Promise.all(
          res.data.map(async (eng) => {
            const capRes = await axios.get(`https://engineering-resource-management-backend-2.onrender.com/api/engineers/engineer/capacity/${eng._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return {
              ...eng,
              capacity: capRes.data,
            };
          })
        );

        setEngineers(enriched);
      } catch (err) {
        console.error("Error fetching engineers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="p-4">Loading engineers...</p>;

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
      <main className="flex-1 bg-blue-200 p-6 space-y-4 ">
        <h1 className="text-2xl font-bold text-blue-800">Team Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {engineers.map((eng) => (
            <div key={eng._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{eng.name}</h2>
                <span className="text-sm text-gray-500">{eng.seniority}</span>
              </div>

              <SkillTags skills={eng.skills} />

              <div className="mt-2 text-sm text-gray-600">
                Department: <strong>{eng.department || "N/A"}</strong>
              </div>

              <div className="mt-3">
                <CapacityBar
                  allocated={eng.capacity.allocated}
                  available={eng.capacity.available}
                  max={eng.capacity.maxCapacity}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
