"use client"
import PlayersList from '@/components/PlayersList'
import { logout } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user)
    const router = useRouter()
    const dispatch = useDispatch()


    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])

    if (!user) return null

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
    }

    return (
        <div>
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-2xl font-bold'>Welcome, {user}</h1>
                <button onClick={handleLogout} className='bg-blue-500 text-white p-2 rounded'>Logout</button>

                <PlayersList />
            </div>
        </div>
    )
}
