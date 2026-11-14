import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Loader from '../../Components/Loader/Loader'
import Post from '../../Components/Post/Post'

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
}

export default function UserProfile() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: myData } = useQuery({
    queryKey: ['getMyProfile'],
    queryFn: () =>
      axios.get('https://route-posts.routemisr.com/users/profile-data', {
        headers: authHeaders(),
      }),
  })

  const myId = myData?.data?.data?.user?._id

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ['getUserProfile', id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
        headers: authHeaders(),
      }),
  })

  const profile =
    profileData?.data?.data?.user ||
    profileData?.data?.user ||
    profileData?.data?.data ||
    null

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['getUserPosts', id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
        headers: authHeaders(),
      }),
  })

  const rawPosts =
    postsData?.data?.data?.posts || postsData?.data?.posts || postsData?.data?.data
  const posts: any[] = Array.isArray(rawPosts) ? rawPosts : []

  const followMutation = useMutation({
    mutationFn: () =>
      axios.put(`https://route-posts.routemisr.com/users/${id}/follow`, {}, {
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserProfile', id] })
      queryClient.invalidateQueries({ queryKey: ['getMyProfile'] })
      queryClient.invalidateQueries({ queryKey: ['getFollowSuggestions'] })
    },
  })

  if (isProfileLoading) {
    return <Loader />
  }

  if (isProfileError || !profile) {
    return (
      <h1 className="text-center text-red-500 font-bold mt-10">
        Error loading profile...
      </h1>
    )
  }

  const followers: any[] = profile?.followers || []
  const followersCount = profile?.followersCount ?? followers.length
  const followingCount = profile?.followingCount ?? profile?.following?.length ?? 0
  const postsCount = profile?.postsCount ?? posts.length

  const isFollowing =
    profile?.isFollowing ??
    followers.some((f: any) => (f?._id || f) === myId)

  const isMe = myId && myId === profile?._id

  const stats = [
    { label: 'Posts', value: postsCount },
    { label: 'Followers', value: followersCount },
    { label: 'Following', value: followingCount },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto my-4">
      <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-slate-800"></div>

        <div className="px-4 sm:px-8 pb-6">
          <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-start md:justify-between gap-5 -mt-14 sm:-mt-16">
            <div className="flex flex-col items-center md:flex-row md:items-end gap-3 md:gap-5 min-w-0 w-full md:w-auto">
              <img
                src={profile?.photo}
                alt={profile?.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover bg-white shadow shrink-0"
              />

              <div className="min-w-0 w-full md:w-auto md:pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">
                  {profile?.name}
                </h1>
                {profile?.username && (
                  <p className="text-slate-500">@{profile.username}</p>
                )}
                {!isMe && (
                  <button
                    onClick={() => followMutation.mutate()}
                    disabled={followMutation.isPending}
                    className={`mt-3 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50 ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {followMutation.isPending
                      ? '...'
                      : isFollowing
                      ? 'Unfollow'
                      : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-8 py-3 text-center"
                >
                  <p className="font-bold text-lg sm:text-xl text-slate-800">{s.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {isPostsLoading ? (
          <p className="text-center text-slate-500 py-10">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500 bg-white border border-slate-200 p-6 rounded-xl">
            No posts yet
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
            {posts.map((post: any) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}