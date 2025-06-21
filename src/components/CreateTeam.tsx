'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addTeam, deleteTeam, Team, updateTeam } from '@/store/slices/teamSlice'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePlayers } from '@/hooks/usePlayers'

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
  const { data: allPlayers = [] } = usePlayers({ search: '' })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([])

  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const isEditing = !!editingTeam


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      playerCount: 5,
    },
  })

  const playerCount = watch('playerCount')

  // Get all players already assigned to any team
  const assignedPlayerIds = teams.flatMap((team) =>
    team.players?.map((p) => p.id) || []
  )

  const currentTeamPlayerIds = editingTeam?.players?.map(p => p.id) || []

  const unassignedPlayers = allPlayers.filter((player) =>
    !assignedPlayerIds.includes(player.id) || currentTeamPlayerIds.includes(player.id)
  )

  // Keep selected players in range
  useEffect(() => {
    setSelectedPlayerIds((prev) => prev.slice(0, playerCount))
  }, [playerCount])

  const onSubmit = (data: FormData) => {
    const selectedPlayers = allPlayers.filter((p) =>
      selectedPlayerIds.includes(p.id)
    )

    if (!isEditing && teams.some((t) => t.name === data.name)) {
      setError('Team name must be unique')
      return
    }

    if (isEditing && editingTeam) {
      dispatch(updateTeam({
        id: editingTeam.id,
        data: {
          name: data.name,
          playerCount: data.playerCount,
          region: data.region,
          country: data.country,
          players: selectedPlayers,
        },
      }))
    } else {
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name: data.name,
        playerCount: data.playerCount,
        region: data.region,
        country: data.country,
        players: selectedPlayers,
      }
      dispatch(addTeam(newTeam))
    }

    reset()
    setSelectedPlayerIds([])
    setEditingTeam(null)
    setIsModalOpen(false)
  }

  const handleEdit = (team: Team) => {
    setIsModalOpen(true)
    setEditingTeam(team)
    reset({
      name: team.name,
      playerCount: team.playerCount,
      region: team.region,
      country: team.country,
    })
    setSelectedPlayerIds(team.players?.map(p => p.id) || [])
  }


  const handleDelete = (id: string) => {
    dispatch(deleteTeam(id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a Team</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + New Team
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded shadow w-[400px] space-y-4"
          >
            <h2 className="text-xl font-semibold">New Team</h2>

            <input {...register('name')} placeholder="Team Name" className="w-full border p-2 rounded" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <input type="number" {...register('playerCount')} placeholder="Player Count" className="w-full border p-2 rounded" />
            {errors.playerCount && <p className="text-red-500">{errors.playerCount.message}</p>}

            <input {...register('region')} placeholder="Region" className="w-full border p-2 rounded" />
            {errors.region && <p className="text-red-500">{errors.region.message}</p>}

            <input {...register('country')} placeholder="Country" className="w-full border p-2 rounded" />
            {errors.country && <p className="text-red-500">{errors.country.message}</p>}

            {/* Player Picker */}
            {unassignedPlayers.length > 0 && (
              <div>
                <label className="font-medium">Select {playerCount} Players:</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded mt-2">
                  {unassignedPlayers.slice(0, 30).map((player) => {
                    const isSelected = selectedPlayerIds.includes(player.id)
                    const disabled = !isSelected && selectedPlayerIds.length >= playerCount

                    return (
                      <label key={player.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={disabled}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedPlayerIds((prev) =>
                                prev.filter((id) => id !== player.id)
                              )
                            } else {
                              setSelectedPlayerIds((prev) => [...prev, player.id])
                            }
                          }}
                        />
                        {player.first_name} {player.last_name}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  reset()
                  setSelectedPlayerIds([])
                  setEditingTeam(null)
                  setError(null)
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams list */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="border p-4 rounded shadow flex flex-col gap-2 bg-white"
          >
            <div>
              <strong>{team.name}</strong> — {team.playerCount} players, {team.region}, {team.country}
            </div>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {team.players?.map((p) => (
                <li key={p.id}>
                  {p.first_name} {p.last_name}
                </li>
              ))}
            </ul>
            <div className="flex gap-4 pt-2">
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
          </div>
        ))}
      </div>

    </div>
  )
}
