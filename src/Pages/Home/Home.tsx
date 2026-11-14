import axios from "axios";
import type { PostType } from "../../Types/Post.type";
import Post from "../../Components/Post/Post";
import Loader from "../../Components/Loader/Loader";
import CreatePost from "../../Components/CreatePost/CreatePost";
import FollowSuggestions from "../../Components/FollowSuggestions/FollowSuggestions";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1>Error...</h1>;
  }

  const allPosts = data?.data?.data?.posts || [];

  return (
    <>
      <div className="my-8">
        <CreatePost />
        <FollowSuggestions />
        {allPosts.map((post: PostType) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </>
  );
}