import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { Link } from "react-router";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Student Profile</h2>
      <div className="mt-4">
        <div>
          <strong>Name:</strong> {user?.displayName || "-"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || "-"}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/exam" className="btn btn-primary">
          Join Exam Room
        </Link>
      </div>
    </div>
  );
};

export default StudentProfile;
