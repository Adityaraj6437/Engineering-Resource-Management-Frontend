import React from "react";

const SkillTags = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {skills.map((skill, idx) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillTags;
