import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import Spinner from '../components/Spinner';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      navigate("/protected");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="mb-4 text-2xl font-bold text-center">Login</h1>
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <input
          className="mb-2 w-full rounded border px-3 py-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="mb-2 w-full rounded border px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
        </button>
        <p className="mt-3 text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer text-blue-600 underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
