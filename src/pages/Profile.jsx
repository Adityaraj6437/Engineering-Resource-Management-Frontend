import React from "react";
import { useAuth } from "../context/AuthContext";
import SkillTags from "../components/SkillTags";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-blue-800">My Profile</h1>

        <div className="bg-white shadow rounded-xl p-6 space-y-5">
          <div>
            <label className="block font-semibold text-gray-600">Name</label>
            <p className="text-gray-800">{user.name}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-600">Email</label>
            <p className="text-gray-800">{user.email}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-600">Seniority</label>
            <p className="text-gray-800 capitalize">{user.seniority || "N/A"}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-600">Department</label>
            <p className="text-gray-800">{user.department || "N/A"}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-600">Skills</label>
            {user.skills && user.skills.length > 0 ? (
              <SkillTags skills={user.skills} />
            ) : (
              <p className="text-gray-500 italic">No skills listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
