import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Loader from '../../Components/Loader/Loader'
import { useParams } from 'react-router-dom'
import Post from '../../Components/Post/Post'
import Comment from '../../Components/Comment/Comment'

export default function PostDetails() {
  const { id } = useParams()
  const [commentContent, setCommentContent] = useState('')
  const [commentsList, setCommentsList] = useState<any[]>([])
  const queryClient = useQueryClient()

  function authHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    }
  }

  const { data: postData, isLoading: isPostLoading, isError: isPostError } = useQuery({
    queryKey: ['getSinglePost', id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: authHeaders(),
      }),
  })

  const post = postData?.data?.data?.post

  const { data: commentsData } = useQuery({
    queryKey: ['getPostComments', id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
        headers: authHeaders(),
      }),
  })

  useEffect(() => {
    const comments = commentsData?.data?.data?.comments
    if (comments) {
      setCommentsList(comments)
    }
  }, [commentsData])

  const addCommentMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`, formData, {
        headers: authHeaders(),
      }),
    onSuccess: () => {
      setCommentContent('')
      queryClient.invalidateQueries({ queryKey: ['getPostComments', id] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', id] })
    },
  })

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentContent.trim()) return

    const formData = new FormData()
    formData.append('content', commentContent)
    addCommentMutation.mutate(formData)
  }

  if (isPostLoading) {
    return <Loader />
  }

  if (isPostError || !post) {
    return <h1 className="text-center text-red-500 font-bold mt-10">Error loading post...</h1>
  }

  return (
    <div className="my-4">
      <Post post={post} />

      <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-5">
        <h2 className="font-bold text-slate-800 mb-3">Comments</h2>

        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="border border-slate-200 bg-slate-50 p-2.5 rounded-lg flex-1 min-w-0 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 shrink-0"
          >
            {addCommentMutation.isPending ? '...' : 'Comment'}
          </button>
        </form>

        <div className="space-y-2">
          {commentsList.length === 0 ? (
            <p className="text-slate-500 text-center bg-slate-50 p-4 rounded-xl">
              No comments yet
            </p>
          ) : (
            commentsList.map((comment: any) => (
              <Comment key={comment._id} comment={comment} postId={id as string} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}