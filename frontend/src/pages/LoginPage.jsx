import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useLoanStore } from "../stores/useLoanStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useUserStore();
  const { saveLoanInDB } = useLoanStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      let loggedInUser = await login({ email, password });
      const loan = JSON.parse(localStorage.getItem('loan'));
      if (loggedInUser && loan) {
        await saveLoanInDB(loan);
        localStorage.removeItem('loan');
      }
    } catch (err) {
      console.error("Login or loan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id === "67f7d50ee40925fefca6a48b") {
      navigate("/admin-dashboard");
    } else if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:cursor-pointer hover:scale-103 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
          >
            Apply for a Loan
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
