"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
   
    // create a client
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
