'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:4000/api/user/login',
        new URLSearchParams({
          email: form.email,
          password: form.password,
        }),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const res = await axios.get('http://localhost:4000/api/user/login-success', {
        withCredentials: true
      });

      setMessage(`Welcome, ${res.data.user.username}`);

      router.push('/'); 
    } catch (error ) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          setMessage(axiosError.response.data.message);
          console.log('Backend error:', axiosError.response.data.message);
        } else {
          setMessage('An unexpected error occurred');
        }

      if (!axiosError.response?.data?.message) {
       setMessage('Login failed. Try again.');
      }
      
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
