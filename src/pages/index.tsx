import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import { CreatePostWizard } from "~/components/createPostWizard";
import { useEffect, useState } from "react";
import { clerkClient } from "@clerk/nextjs/server";
import dayjs from "dayjs";



type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const welcomeMessage = "This website was created using the t3 stack. It has the some basic functionality, at it's base it is a forum-based website that allows users to submit posts, which can include text, links, images, and videos, and interact with those posts through comments and likes. There are multiple Sub Echo Spaces you can visit and intract with. You can also create your own spaces. Try to keep it civil or I'll have to delete ya. "
const sideBar = (echoCount: number, userCount: number) => {

  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">Welcome to Echo</h3>
      <span className="font-normal text-lg text-slate-400">{welcomeMessage} </span>
      <div className="flex flex-row space-x-3">

        {echoCount && <span className="font-normal italic text-lg text-slate-400">{echoCount} Echo Spaces</span>}
        {userCount && <span className="font-normal italic text-lg text-slate-400">{userCount} Users</span>}
      </div>
      <CreatePostWizard />
    </div>
  )
}
export default function Home() {
  // const { data, isLoading } = api.posts.getAll.useQuery()
  const [orderKey, setOrderKey,] = useState<string>('createdAt')
  const [orderVal, setOrderVal] = useState<string>('asc')
  const { data, isLoading } = api.posts.getAll.useQuery()
  const [posts, setPosts,] = useState<PostWithUser[]>([])
  const { data: count } = api.subEcho.getAllCount.useQuery()
  const { } = useUser()
  useEffect(() => {
    data && setPosts([...data])
  }, [data])
  useEffect(() => {
    let newPosts = posts
    if (orderKey === 'likes') {
      if (orderVal === 'asc') newPosts.sort((a, b) => a.likes.length - b.likes.length)
      if (orderVal === 'desc') newPosts.sort((a, b) => b.likes.length - a.likes.length)
    }
    if (orderKey === 'createdAt') {
      if (orderVal === 'asc') newPosts.sort((a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)))
      if (orderVal === 'desc') newPosts.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))
    }
    setPosts([...newPosts])
  }, [orderKey, orderVal])

  if (isLoading) return <LoadingPage />
  if (!data || !posts) return <div>Could not load feed</div>

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 p-2">
        <div className="flex flex-row space-x-2">

          <button onClick={() => { setOrderVal('asc'); setOrderKey('likes') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Least Liked First</button>
          <button onClick={() => { setOrderVal('desc'); setOrderKey('likes') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Most Liked First</button>
          <button onClick={() => { setOrderVal('asc'); setOrderKey('createdAt') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Oldest First</button>
          <button onClick={() => { setOrderVal('desc'); setOrderKey('createdAt') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Newest First</button>
        </div>
        <div className="block md:hidden">
          <CreatePostWizard />
        </div>
        {
          posts.map((post) => <Post key={post.id} {...post} />)
        }
      </div>
      <div className="hidden md:flex flex-col w-1/3">
        {count && sideBar(count.echoSpaces, count.users)}
      </div>
    </div>
  );
}
