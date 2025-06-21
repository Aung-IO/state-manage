"use client";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePlayers } from "@/hooks/usePlayers";

export default function PlayerList() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const playersPerPage = 10;

  const { data: allPlayers, isLoading } = usePlayers({ search: debouncedSearch });

  const paginatedPlayers = useMemo(() => {
    if (!allPlayers) return [];
    const start = (page - 1) * playersPerPage;
    return allPlayers.slice(start, start + playersPerPage);
  }, [allPlayers, page]);

  const totalPages = useMemo(() => {
    return allPlayers ? Math.ceil(allPlayers.length / playersPerPage) : 1;
  }, [allPlayers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Players</h1>

      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search players..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => setSearch("")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {paginatedPlayers.map((player) => (
          <li
            key={player.id}
            className="border p-4 rounded shadow-sm text-center"
          >
            <p className="font-semibold text-gray-800">
              {player.first_name} {player.last_name}
            </p>
          </li>
        ))}
      </ul>





      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
