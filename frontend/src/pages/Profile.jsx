import React, { useEffect, useState } from "react";
import axios from "../config/axios";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/profile");
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200">
        <div className="text-red-600 font-medium">Failed to load profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transition-transform transform hover:scale-[1.015]">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">👤 Profile</h2>

        <div className="space-y-3 mb-6">
          <div>
            <span className="font-semibold text-gray-700">Name:</span> {data.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span> {data.email}
          </div>
          <div>
            <span className="font-semibold text-gray-700">ID:</span> {data._id}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-500">📁 Projects</h3>
          {data.projects && data.projects.length > 0 ? (
            <ul className="max-h-40 overflow-y-auto space-y-2 list-disc list-inside text-gray-800">
              {data.projects.map((project) => (
                <li key={project._id} className="pl-2">
                  <span className="font-medium">{project.Projectname || project.name}</span>
                  {project.description && (
                    <span className="text-gray-500"> – {project.description}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No projects found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
