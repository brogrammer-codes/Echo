import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { CreatePostWizard } from "~/components/createPostWizard";


export default function Home() {
  const { data, isLoading } = api.posts.getAll.useQuery()
  const { user, } = useUser()
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 p-2">
        <div className="block md:hidden">

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
