'use client';

import React from 'react';

export default function LoginPage() {
  const handleGitHubLogin = () => {
    // Redirect to your Express backend GitHub login route
    window.location.href = 'http://localhost:4000/auth/github/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Login with GitHub</h1>
      <button
        onClick={handleGitHubLogin}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        Login with GitHub
      </button>
    </div>
  );
}
