import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { Link } from "react-router";

const TeacherProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Teacher Profile</h2>
      <div className="mt-4">
        <div>
          <strong>Name:</strong> {user?.displayName || "-"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || "-"}
        </div>
      </div>

      <div className="mt-6 space-x-2">
        <Link to="/exam" className="btn btn-secondary">
          Create Exam Room
        </Link>
      </div>
    </div>
  );
};

export default TeacherProfile;
