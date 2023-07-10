import { useUser } from "@clerk/nextjs";
import type { UserResource } from '@clerk/types';

import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { useState } from "react";
import { useGetAllPosts } from "~/hooks";
import Link from "next/link";
import { SortPostBar } from "~/components/SortPostBar";
import { SortOrderVal } from "~/utils/enums";



const welcomeMessage = "This website was created using the t3 stack. This is in an experemental state so if things are broken please let me know. It has the some basic functionality, at it's base it is a forum-based website that allows users to submit posts, which can include text, links, images, and videos, and interact with those posts through comments and likes. There are multiple Sub Echo Spaces you can visit and intract with. You can also create your own spaces. Try to keep it civil or I'll have to delete ya. "
const sideBar = (echoCount: number, userCount: number, user: UserResource | null | undefined) => {

  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">Welcome to Echo</h3>
      <span className="font-normal text-lg text-slate-400">{welcomeMessage} </span>
      <div className="flex flex-row space-x-3">

        {echoCount && <span className="font-normal italic text-lg text-slate-400">{echoCount} Echo Spaces</span>}
        {userCount && <span className="font-normal italic text-lg text-slate-400">{userCount} Users</span>}
      </div>
      {user && <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={'/new'}>Create Post</Link>}
    </div>
  )
}
export default function Home() {
  const [orderKey, setOrderKey,] = useState<SortOrderVal>(SortOrderVal.CREATED_ASC)
  const { posts, postsLoading, allPostsError } = useGetAllPosts(orderKey)
  const { data: count } = api.subEcho.getAllCount.useQuery()
  const { user } = useUser()

  if (postsLoading) return <LoadingPage />

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 p-2">
        <SortPostBar order={orderKey} setOrder={setOrderKey} />
        <div className="block sm:hidden my-3 p-2">
          {user && <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={'/new'}>Create Post</Link>}
        </div>
        {
          (!posts || allPostsError) ? (<div>Error Loading Feed, please refresh page. </div>) : posts.map((post) => <Post key={post.id} {...post} />)
        }
      </div>
      <div className="hidden sm:flex flex-col w-1/3">
        {count && sideBar(count.echoSpaces, count.users, user)}
      </div>
    </div>
  );
}
