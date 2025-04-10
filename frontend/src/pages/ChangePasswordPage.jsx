import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ChangePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { changePassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await changePassword({ password, confirmPassword });
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">Change Password</h2>
        <p className="text-center text-sm text-gray-600">
          Set a new password to secure your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:cursor-pointer hover:scale-103"
          >
            Update Password
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Go back to{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordPage;