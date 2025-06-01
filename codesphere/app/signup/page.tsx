'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile_image_url: '',
  });
  
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //what is e?
  //"e is a ChangeEvent coming from an **HTML <input> element`."
  //If you accidentally use e.target.checked on a text input (which doesn't exist), TypeScript will warn you.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/user/signup', form);
      setSuccess("Signup successful! Redirecting to login...");
      setError(null);
      console.log('Signup success:', res.data);

    
      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
       if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message); 
        console.log('Backend error:', axiosError.response.data.message);
         } else {
        setError('An unexpected error occurred');
  }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
      <input name="profile_image_url" placeholder="Image URL (optional)" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
