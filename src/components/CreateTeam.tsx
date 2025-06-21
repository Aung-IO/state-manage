'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addTeam, deleteTeam, Team, updateTeam } from '@/store/slices/teamSlice'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const schema = z.object({
  name: z.string().min(1, 'Team name is required'),
  playerCount: z.coerce.number().min(1, 'Must have at least 1 player'),
  region: z.string().min(1, 'Region is required'),
  country: z.string().min(1, 'Country is required'),
})

type FormData = z.infer<typeof schema>

export default function CreateTeamPage() {
  const dispatch = useDispatch()
  const teams = useSelector((state: RootState) => state.teams)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const createdTeams = localStorage.getItem('teams')
    ? JSON.parse(localStorage.getItem('teams') || '[]')
    : ([] as Team[])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    try {
      // Check if team name already exists
      if (teams.some((t) => t.name === data.name)) {
        setError('Team name must be unique')
        return
      }

      dispatch(addTeam(data))
      reset()
      setError(null)
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err.message)
    }
  }
  const handleDelete = (id: string) => {
    dispatch(deleteTeam(id))

  }

  const handleEdit = (team: Team) => {
    console.log('Editing team:', team);
    setEditingTeam(team)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Team</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + New Team
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-50 p-6 rounded shadow w-[400px] space-y-4"
          >
            <h2 className="text-xl font-semibold">New Team</h2>

            <input
              {...register('name')}
              placeholder="Team Name"
              className="w-full border p-2 rounded"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <input
              type="number"
              {...register('playerCount')}
              placeholder="Player Count"
              className="w-full border p-2 rounded "
            />
            {errors.playerCount && (
              <p className="text-red-500">{errors.playerCount.message}</p>
            )}

            <input
              {...register('region')}
              placeholder="Region"
              className="w-full border p-2 rounded "
            />
            {errors.region && <p className="text-red-500">{errors.region.message}</p>}

            <input
              {...register('country')}
              placeholder="Country"
              className="w-full border p-2 rounded "
            />
            {errors.country && <p className="text-red-500">{errors.country.message}</p>}

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  reset()
                  setError(null)
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      {editingTeam && (
        <div className="mt-4 p-4 border rounded bg-gray-50 max-w-md">
          <h2 className="font-bold mb-2">Edit Team</h2>
          <input
            type="text"
            value={editingTeam.name}
            onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          {/* Add inputs for other editable fields, e.g., playerCount, region, country */}
          <input
            type="number"
            value={editingTeam.playerCount}
            onChange={(e) =>
              setEditingTeam({ ...editingTeam, playerCount: Number(e.target.value) })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={editingTeam.region}
            onChange={(e) => setEditingTeam({ ...editingTeam, region: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={editingTeam.country}
            onChange={(e) => setEditingTeam({ ...editingTeam, country: e.target.value })}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={() => {
              dispatch(
                updateTeam({
                  id: editingTeam.id,
                  data: {
                    name: editingTeam.name,
                    playerCount: editingTeam.playerCount,
                    region: editingTeam.region,
                    country: editingTeam.country,
                  },
                })
              );
              setEditingTeam(null);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditingTeam(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}



      {/* 🧾 Optional: Show current teams */}
      <ul className="mt-6 space-y-2">
        {createdTeams.map((team: Team) => (
          <li key={team.id} className="border p-3 rounded flex items-center justify-between gap-4">
            <div>
              <strong>{team.name}</strong> — {team.playerCount} players, {team.region}, {team.country}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(team)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}
