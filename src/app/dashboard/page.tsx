"use client";
import CreateTeamPage from '@/components/CreateTeam'
import PlayersList from '@/components/PlayersList'
import { login, logout } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const router = useRouter()

  const [isHydrated, setIsHydrated] = useState(false) // <-- add hydration check

  // 1. Hydrate state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      dispatch(login(storedUser))
    }
    setIsHydrated(true)
  }, [dispatch])

  // 2. Redirect if no user after hydration
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/')
    }
  }, [isHydrated, user, router])

  if (!isHydrated) return null // <-- Wait until hydration is complete
  if (!user) return null       // <-- Or show a loading state

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome, {user}</h1>
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>

      <PlayersList />
      <CreateTeamPage />
    </div>
  );
}
