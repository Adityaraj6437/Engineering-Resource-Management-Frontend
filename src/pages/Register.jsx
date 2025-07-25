// src/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "engineer",
    skills: "",
    seniority: "",
    maxCapacity: "",
    department: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
    };

    try {
      await axios.post("https://engineering-resource-management-bac.vercel.app/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>

          {formData.role === "engineer" && (
            <>
              <input
                name="skills"
                type="text"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {/* "junior", "mid", "senior" */}
              <select
            name="seniority"
            value={formData.seniority}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="junior">junior</option>
            <option value="mid">mid</option>
            <option value="senior">senior</option>
          </select>
              
              <input
                name="maxCapacity"
                type="number"
                placeholder="Max Capacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              <input
                name="department"
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

          {/* ✅ Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
