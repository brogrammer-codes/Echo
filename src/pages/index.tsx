import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import { CreatePostWizard } from "~/components/createPostWizard";
import { useEffect, useState } from "react";


const SortBar = () => {

}
type PostWithUser = RouterOutputs["posts"]["getAll"][number]

export default function Home() {
  // const { data, isLoading } = api.posts.getAll.useQuery()
  const [order, setOrder,] = useState<string>('asc')
  const { data, isLoading, refetch } = api.posts.getAll.useQuery({order})
  const [posts, setPosts,] = useState<PostWithUser[]>([])
  const { user, } = useUser()
  useEffect(() => {
    refetch()
  }, [order])
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 p-2">
        <div className="block md:hidden">
          <div>

          <button onClick={() => setOrder('asc')}>Asc</button>
          <button onClick={() => setOrder('desc')}>Dsc</button>
          </div>
          <CreatePostWizard />
        </div>
        {
          data.map((post) => <Post key={post.id} {...post} />)
        }
      </div>
      <div className="hidden md:flex flex-col w-1/3">
        <h3>Welcome to Echo</h3>
        <span>I created this using the t3 stack</span>
        <CreatePostWizard />
      </div>
    </div>
  );
}
