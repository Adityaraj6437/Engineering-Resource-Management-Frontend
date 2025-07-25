import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SkillTags from "../components/SkillTags";

const ProjectDetails = () => {
  const { id } = useParams(); // Project ID from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  if (loading)
    return (
      <div className="p-6 text-gray-700  bg-blue-100 text-center">
        <span className="text-blue-600 font-medium">Loading project details...</span>
      </div>
    );

  if (!project)
    return (
      <div className="p-6 text-red-500 text-center">
        Project not found or failed to load.
      </div>
    );

  return (
    <div className="p-6 max-w-4xl bg-blue-100 mx-auto space-y-6 bg-blue-100">
      {/* Project Title */}
      <div className="bg-blue-100 shadow rounded-xl p-6 space-y-2">
        <h1 className="text-3xl font-bold text-blue-800">{project.name}</h1>
        <p className="text-gray-700 text-lg">{project.description}</p>
      </div>

      {/* Project Meta Details */}
      <div className="bg-white shadow rounded-xl p-6 grid md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                project.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : project.status === "active"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {project.status}
            </span>
          </p>
          <p className="mt-2">
            <strong>Team Size:</strong> {project.teamSize}
          </p>
        </div>

        <div>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <strong>End Date:</strong>{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Required Skills
        </h3>
        <SkillTags skills={project.requiredSkills || []} />
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Description
        </h3>
        {project.description}
      </div>

      {/* Future: Add assigned engineers, capacity progress, etc. */}
    </div>
  );
};

export default ProjectDetails;
