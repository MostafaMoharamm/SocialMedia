import { AiFillLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa6";
import { LiaCommentSolid } from "react-icons/lia";
import type { PostType } from "../../Types/Post.type";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PostProps {
  post: PostType;
}

function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Post({ post }: PostProps) {
  const { body, image, user, createdAt, topComment, _id } = post;
  const { name, photo } = user;
  const queryClient = useQueryClient();

  const likesCount =
    (post as any)?.likes?.length ?? (post as any)?.likesCount ?? 0;

  const likePostMutation = useMutation({
    mutationFn: () => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-5 my-4">
      <Link
        to={`/userprofile/${(user as any)?._id}`}
        className="flex gap-3 items-center w-fit max-w-full"
      >
        <img
          src={photo}
          className="w-11 h-11 rounded-full border-2 border-indigo-100 object-cover shrink-0"
          alt={name}
        />
        <div className="min-w-0">
          <p className="font-bold text-slate-800 truncate hover:text-indigo-600 transition">
            {name}
          </p>
          <p className="text-xs text-slate-500">{formatDate(createdAt)}</p>
        </div>
      </Link>

      <div className="mt-3">
        {body && (
          <p className="text-slate-700 break-words whitespace-pre-wrap">{body}</p>
        )}
        {image && (
          <img
            className="w-full max-h-[480px] object-cover rounded-xl mt-3"
            src={image}
            alt=""
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-1 bg-slate-50 rounded-xl p-1 text-sm sm:text-base">
        <button
          onClick={() => likePostMutation.mutate()}
          disabled={likePostMutation.isPending}
          className="flex-1 flex gap-2 items-center justify-center font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition disabled:opacity-50"
        >
          <AiFillLike />
          <span>
            Like <span className="hidden sm:inline">({likesCount})</span>
            <span className="sm:hidden">{likesCount}</span>
          </span>
        </button>

        <button className="flex-1 flex gap-2 items-center justify-center font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition">
          <FaShare />
          <span>Share</span>
        </button>

        <Link
          to={`/postdetails/${_id}`}
          className="flex-1 flex gap-2 items-center justify-center font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition"
        >
          <LiaCommentSolid className="text-lg" />
          <span>Comments</span>
        </Link>
      </div>

      {topComment && (
        <div className="mt-3">
          <Comment comment={topComment} />
        </div>
      )}
    </div>
  );
}