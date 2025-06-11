'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'password') checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        router.push('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Something went wrong!');
    }
  };

  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthText = ['very poor', 'poor', 'moderate', 'strong'];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-lg font-semibold text-center mb-6">
          Sign up to download unlimited full resolution media
        </h1>

        <button className="flex items-center justify-center w-full gap-2 py-2 mb-3 border rounded-full">
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>

        <button className="flex items-center justify-center w-full gap-2 py-2 mb-6 border rounded-full">
          <FaFacebook className="text-blue-600 text-xl" />
          Continue with Facebook
        </button>

        <div className="relative text-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative bg-white px-2 text-sm text-gray-400">or</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">* Username</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. maria93"
              className="w-full p-2 border rounded"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium">* Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full p-2 border rounded"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium">* Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full p-2 border rounded"
              required
              value={form.password}
              onChange={handleChange}
            />
            <div className="mt-1 h-2 w-full bg-gray-200 rounded">
              <div
                className={`h-2 rounded transition-all ${strengthColors[passwordStrength - 1] || 'bg-red-500'}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
            <p className="text-sm text-red-500 mt-1">
              Strength {strengthText[passwordStrength - 1] || 'very poor'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          >
            Join
          </button>
        </form>
      </div>
    </main>
  );
}
