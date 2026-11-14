import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Loader from '../../Components/Loader/Loader'
import Post from '../../Components/Post/Post'

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
}

function pickList(res: any, key: string): any[] {
  const d = res?.data
  const list = d?.data?.[key] || d?.[key] || d?.data
  return Array.isArray(list) ? list : []
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts')
  const queryClient = useQueryClient()

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ['getMyProfile'],
    queryFn: () =>
      axios.get('https://route-posts.routemisr.com/users/profile-data', {
        headers: authHeaders(),
      }),
  })

  const profile =
    profileData?.data?.data?.user ||
    profileData?.data?.user ||
    profileData?.data?.data ||
    null

  const userId = profile?._id

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['getMyPosts', userId],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
        headers: authHeaders(),
      }),
    enabled: !!userId,
  })

  const myPosts = pickList(postsData, 'posts')

  const { data: bookmarksData, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['getMyBookmarks'],
    queryFn: () =>
      axios.get('https://route-posts.routemisr.com/users/bookmarks', {
        headers: authHeaders(),
      }),
    enabled: activeTab === 'bookmarks',
  })

  const bookmarks = pickList(bookmarksData, 'bookmarks')

  const uploadPhotoMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.put('https://route-posts.routemisr.com/users/upload-photo', formData, {
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMyProfile'] })
      queryClient.invalidateQueries({ queryKey: ['getMyPosts'] })
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
    },
  })

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)
    uploadPhotoMutation.mutate(formData)
    e.target.value = ''
  }

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

  const postsCount = profile?.postsCount ?? myPosts.length
  const followersCount = profile?.followersCount ?? profile?.followers?.length ?? 0
  const followingCount = profile?.followingCount ?? profile?.following?.length ?? 0

  const listToShow = activeTab === 'posts' ? myPosts : bookmarks
  const isListLoading = activeTab === 'posts' ? isPostsLoading : isBookmarksLoading

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
              <div className="relative shrink-0">
                <img
                  src={profile?.photo}
                  alt={profile?.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover bg-white shadow"
                />
                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-lg cursor-pointer transition"
                >
                  {uploadPhotoMutation.isPending ? '...' : 'Edit'}
                </label>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploadPhotoMutation.isPending}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 w-full md:w-auto md:pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">
                  {profile?.name}
                </h1>
                {profile?.username && (
                  <p className="text-slate-500">@{profile.username}</p>
                )}
                {profile?.email && (
                  <p className="text-sm text-slate-500 mt-1 break-all">{profile.email}</p>
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

          {uploadPhotoMutation.isError && (
            <p className="text-red-500 text-sm font-bold mt-3 text-center md:text-start">
              Failed to upload photo
            </p>
          )}
        </div>
      </div>

      <div className="w-full mt-4 flex gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 rounded-xl font-bold transition ${
            activeTab === 'posts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-3 rounded-xl font-bold transition ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Bookmarks
        </button>
      </div>

      <div className="mt-4">
        {isListLoading ? (
          <p className="text-center text-slate-500 py-10">Loading...</p>
        ) : listToShow.length === 0 ? (
          <p className="text-center text-slate-500 bg-white border border-slate-200 p-6 rounded-xl">
            {activeTab === 'posts' ? 'No posts yet' : 'No bookmarks yet'}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
            {listToShow.map((post: any) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}