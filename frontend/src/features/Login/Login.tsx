import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import TextInput from "@/components/form/TextInput";
import Button from "@/components/form/Button";


export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      setProcessing(true);
      await login(username, password);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    }
    finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <TextInput
            label="Username"
            name="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            placeholder="Enter your username"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            placeholder="Enter your password"
          />
          {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
          <Button type="submit" variant="primary" disabled={!!error || processing} className="mt-6 w-full flex items-center justify-center">
            {processing ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
