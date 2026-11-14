import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
}

export default function FollowSuggestions() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['getFollowSuggestions'],
    queryFn: () =>
      axios.get('https://route-posts.routemisr.com/users/suggestions?limit=10', {
        headers: authHeaders(),
      }),
  })

  const d = data?.data
  const raw = d?.data?.suggestions || d?.data?.users || d?.suggestions || d?.data
  const suggestions: any[] = Array.isArray(raw) ? raw : []

  const followMutation = useMutation({
    mutationFn: (userId: string) =>
      axios.put(`https://route-posts.routemisr.com/users/${userId}/follow`, {}, {
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFollowSuggestions'] })
      queryClient.invalidateQueries({ queryKey: ['getMyProfile'] })
      queryClient.invalidateQueries({ queryKey: ['getUserProfile'] })
    },
  })

  if (isLoading || suggestions.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-5 my-4">
      <h2 className="font-bold text-slate-800 mb-3">People you may know</h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {suggestions.map((user: any) => {
          const isPending = followMutation.isPending && followMutation.variables === user._id

          return (
            <div
              key={user._id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-36 sm:w-40 shrink-0 flex flex-col items-center text-center"
            >
              <Link to={`/userprofile/${user._id}`} className="flex flex-col items-center w-full">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-indigo-100 object-cover"
                />
                <p className="font-bold mt-2 text-sm text-slate-800 w-full truncate">{user.name}</p>
                {user.username && (
                  <p className="text-xs text-slate-500 w-full truncate">@{user.username}</p>
                )}
              </Link>

              <button
                onClick={() => followMutation.mutate(user._id)}
                disabled={isPending}
                className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-1.5 rounded-lg transition disabled:opacity-50"
              >
                {isPending ? '...' : 'Follow'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}