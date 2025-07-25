import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CapacityBar from "../components/CapacityBar";

const EngineerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [assignmentsRes, capacityRes] = await Promise.all([
          axios.get("https://engineering-resource-management-bac.vercel.app/api/assignments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://engineering-resource-management-bac.vercel.app/api/engineers/engineer/capacity/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const myAssignments = assignmentsRes.data
          .filter((a) => a.engineerId?._id?.toString() === user._id?.toString())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setAssignments(myAssignments);
        setCapacity(capacityRes.data);
      } catch (err) {
        console.error("❌ Failed to load engineer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const today = new Date();

  const [current, upcoming] = useMemo(() => {
    const curr = [];
    const upc = [];
    assignments.forEach((a) => {
      const s = new Date(a.startDate);
      const e = new Date(a.endDate);
      if (s <= today && e >= today) curr.push(a);
      else if (s > today) upc.push(a);
    });
    return [curr, upc];
  }, [assignments, today]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-blue-700 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">Engineer Dashboard</h1>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-blue-700 hover:underline font-medium">
            My Assignments
          </Link>
          <Link to="/profile" className="text-blue-700 hover:underline font-medium">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Welcome and Capacity */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Hi, {user.name}</h2>
              <p className="text-sm text-gray-600 capitalize">
                Role: {user.role} {user.seniority && `• ${user.seniority}`}
              </p>
            </div>

            {capacity && (
              <div className="w-full sm:w-80">
                <p className="text-sm text-gray-600 mb-1">
                  Current Capacity ({capacity.allocated}% allocated)
                </p>
                <CapacityBar
                  allocated={capacity.allocated}
                  available={capacity.available}
                  max={capacity.maxCapacity}
                />
              </div>
            )}
          </div>

          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Current Assignments */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Current Assignments</h3>

          {current.length === 0 ? (
            <p className="text-gray-500 text-sm bg-white rounded-xl shadow p-4">
              You have no current assignments.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {current.map((a) => (
                <AssignmentCard key={a._id} a={a} />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Assignments */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Assignments</h3>

          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm bg-white rounded-xl shadow p-4">
              You have no upcoming assignments.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcoming.map((a) => (
                <AssignmentCard key={a._id} a={a} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const AssignmentCard = ({ a }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h4 className="font-semibold text-gray-800">
        {a.projectId?.name || "Unknown Project"}
      </h4>

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
  );
};

export default EngineerDashboard;
