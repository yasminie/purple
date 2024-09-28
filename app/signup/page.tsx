// app/signup/page.tsx
'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundBeams } from '@/components/ui/background-beams';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/main'); // Redirect to main page after successful signup
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to sign up'); // Display error message from the server
      }
    } catch (error) {
      setError('An unexpected error occurred during signup.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#240046]">
      <BackgroundBeams/>

      <form onSubmit={handleSubmit} className="relative z-20 text-center bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center text-black roboto">Sign Up</h2>
        <input
          className="w-full p-2 mb-5 border border-gray-300 rounded-lg text-gray-900"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-gray-900"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-gray-900"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-gray-900"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button type="submit" className="p-[3px] relative m-2 justify-center ">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="roboto px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                Sign Up
              </div>
        </button>
        <p className="text-center mt-5 text-black roboto">Have an account? <Link href={'/'} className="cursor-pointer text-[#9D4EDD] hover:text-[#7B2CBF]">Login</Link></p>
      </form>
    </div>
  );
}

