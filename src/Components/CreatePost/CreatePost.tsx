import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export default function CreatePost() {
  const [body, setBody] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post('https://route-posts.routemisr.com/posts', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }),
    onSuccess: () => {
      setBody('')
      setImage(null)
      setPreview('')
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
      queryClient.invalidateQueries({ queryKey: ['getMyPosts'] })
    },
  })

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function removeImage() {
    setImage(null)
    setPreview('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() && !image) return

    const formData = new FormData()
    if (body.trim()) formData.append('body', body)
    if (image) formData.append('image', image)

    createPostMutation.mutate(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-5 my-4"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl resize-none focus:outline-none focus:border-indigo-500 focus:bg-white transition"
      />

      {preview && (
        <div className="relative mt-3">
          <img src={preview} alt="" className="w-full max-h-72 object-cover rounded-xl" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-lg"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex justify-between items-center gap-3 mt-3">
        <label
          htmlFor="post-image"
          className="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold px-4 py-2 rounded-lg cursor-pointer transition text-sm sm:text-base"
        >
          Add Image
        </label>
        <input
          id="post-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="submit"
          disabled={createPostMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
        >
          {createPostMutation.isPending ? 'Posting...' : 'Post'}
        </button>
      </div>

      {createPostMutation.isError && (
        <p className="text-red-500 text-sm font-bold mt-3">Failed to create post</p>
      )}
    </form>
  )
}