import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { AiFillLike } from 'react-icons/ai'
import type { CommentType } from '../../Types/Comment.type'

function formatDate(date?: string) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Comment({ comment, postId: postIdProp }: { comment: CommentType; postId?: string }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment?.content || '')
  const queryClient = useQueryClient()

  const postId = postIdProp || comment?.post
  const commentId = comment?._id

  function authHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    }
  }

  const { data: repliesData, isLoading: isRepliesLoading } = useQuery({
    queryKey: ['getCommentReplies', postId, commentId],
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
        { headers: authHeaders() }
      ),
    enabled: showReplies && !!postId && !!commentId,
  })

  const replies: any[] =
    repliesData?.data?.data?.replies ||
    repliesData?.data?.replies ||
    repliesData?.data?.data ||
    []

  const deleteCommentMutation = useMutation({
    mutationFn: () =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        { headers: authHeaders() }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPostComments', postId] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        formData,
        { headers: authHeaders() }
      ),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['getPostComments', postId] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
    },
  })

  const likeCommentMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
        {},
        { headers: authHeaders() }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPostComments', postId] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
    },
  })

  const addReplyMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
        formData,
        { headers: authHeaders() }
      ),
    onSuccess: () => {
      setReplyContent('')
      setShowReplies(true)
      queryClient.invalidateQueries({ queryKey: ['getCommentReplies', postId, commentId] })
      queryClient.invalidateQueries({ queryKey: ['getPostComments', postId] })
    },
  })

  function handleAddReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    const formData = new FormData()
    formData.append('content', replyContent)
    addReplyMutation.mutate(formData)
  }

  function handleUpdateComment(e: React.FormEvent) {
    e.preventDefault()
    if (!editContent.trim()) return

    const formData = new FormData()
    formData.append('content', editContent)
    updateCommentMutation.mutate(formData)
  }

  return (
    <div className="my-2 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex gap-3 items-start">
        <img
          src={comment?.commentCreator?.photo}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-indigo-100 object-cover shrink-0"
          alt=""
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate">{comment?.commentCreator?.name}</p>
              <p className="text-xs text-slate-500">{formatDate(comment?.createdAt)}</p>
            </div>

            {postId && (
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => {
                    setEditContent(comment?.content || '')
                    setIsEditing((prev) => !prev)
                  }}
                  className="text-emerald-600 text-sm font-semibold hover:text-emerald-800"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteCommentMutation.mutate()}
                  disabled={deleteCommentMutation.isPending}
                  className="text-red-500 text-sm font-semibold hover:text-red-700 disabled:opacity-50"
                >
                  {deleteCommentMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateComment} className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border border-slate-200 bg-white p-2 rounded-lg flex-1 min-w-0 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={updateCommentMutation.isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </form>
          ) : (
            <p className="mt-1 text-slate-700 break-words whitespace-pre-wrap">{comment?.content}</p>
          )}

          {postId && (
            <div className="flex gap-4 items-center mt-2">
              <button
                onClick={() => likeCommentMutation.mutate()}
                disabled={likeCommentMutation.isPending}
                className="flex gap-1 items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 disabled:opacity-50"
              >
                <AiFillLike />
                Like ({comment?.likes?.length || 0})
              </button>
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
              >
                {showReplies ? 'Hide replies' : 'View replies'}
              </button>
            </div>
          )}
        </div>
      </div>

      {postId && showReplies && (
        <div className="mt-3 ms-4 sm:ms-12 space-y-2">
          <form onSubmit={handleAddReply} className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="border border-slate-200 bg-white p-2 rounded-lg flex-1 min-w-0 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={addReplyMutation.isPending}
              className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 shrink-0"
            >
              {addReplyMutation.isPending ? '...' : 'Reply'}
            </button>
          </form>

          {isRepliesLoading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : replies.length === 0 ? (
            <p className="text-sm text-slate-500">No replies yet</p>
          ) : (
            replies.map((reply: any) => (
              <div key={reply._id} className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="flex gap-3 items-center">
                  <img
                    src={reply?.commentCreator?.photo}
                    className="w-8 h-8 rounded-full border-2 border-indigo-100 object-cover shrink-0"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{reply?.commentCreator?.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(reply?.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-700 break-words whitespace-pre-wrap">{reply?.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}