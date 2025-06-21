'use client'

import { useState, useEffect } from 'react'
import { usePlayers } from '@/hooks/usePlayers'

export default function PlayersList() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  // Debounce logic: update debouncedSearch 500ms after user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 500)

    return () => clearTimeout(timeout)
  }, [search])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = usePlayers({ search: debouncedSearch, page })

  const totalPages = data?.meta?.total_pages || 1

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NBA Players</h1>

      <input
        className="w-full border p-2 mb-4 rounded"
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      ) : (
        <>
          <ul className="space-y-2">
            {data?.data.map((player: any) => (
              <li key={player.id}>
                {player.first_name} {player.last_name} — {player.team.full_name}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {isFetching && <p className="text-sm text-gray-500 mt-2">Updating...</p>}
        </>
      )}
    </main>
  )
}
