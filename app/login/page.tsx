// app/login/page.tsx
'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset the error state

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/main'); // Redirect to main page after login
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to log in'); // Display error message from the server
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Log In</h2>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Log In
        </button>
      </form>
    </div>
  );
}