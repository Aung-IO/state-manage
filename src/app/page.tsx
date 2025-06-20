"use client";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const router = useRouter()

   const handleLogin = () => {
    if (!username.trim()) return alert('Enter a username')
    dispatch(login(username))
    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-24">
      <h1 className="text-2xl font-bold">Login Form</h1>
     <div>
       <input
        type="text"
        value={username}
        placeholder="Enter Username"
        onChange={(e) => setUsername(e.target.value)} />

      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login</button>
     </div>
    </main>
  );
}
