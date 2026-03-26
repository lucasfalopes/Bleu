"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignIn() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsRegistering(false);
        alert("Registration successful! Please sign in.");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-electric-blue">L&apos;Élan</h1>
        <p className="text-gray-500 text-center mb-8">{isRegistering ? "Create your account" : "Sign in to continue"}</p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-electric-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-electric-blue"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-electric-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 mt-4">
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">{isRegistering ? "Already have an account?" : "Don't have an account?"}</span>
          <button
            type="button"
            onClick={() => {setIsRegistering(!isRegistering); setError("");}}
            className="ml-2 text-electric-blue font-medium hover:underline"
          >
            {isRegistering ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
