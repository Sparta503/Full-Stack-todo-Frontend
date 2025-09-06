import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProtected } from '../api';
import Spinner from '../components/Spinner';

export default function Protected() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getProtected(token)
      .then((res) => setData(res))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (loading) return <Spinner />;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-xl font-bold">Protected Page</h1>
        <p className="mb-4">Welcome, {data?.username ?? "User"} 🎉</p>
        <button
          onClick={logout}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
