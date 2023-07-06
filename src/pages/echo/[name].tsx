import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import { CreatePostWizard } from "~/components/createPostWizard";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { auth, useUser } from "@clerk/nextjs";
import { Textarea } from "~/components/atoms";
import Link from "next/link";


type SubEcho = RouterOutputs["subEcho"]["getSubEchoByName"]
interface SideBarProps {
  echo: SubEcho;
  numPosts: number
}
const SideBar = ({echo, numPosts}: SideBarProps) => {
  const { user } = useUser()
  const ctx = api.useContext()
  const [editDescription, setEditDescription] = useState<boolean>(false)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const { id, title, description, authorId } = echo
  useEffect(() => {
    if (descRef.current) descRef.current.value = description
  }, [])

  const { mutate, isLoading } = api.subEcho.updateSubEcho.useMutation({
    onSuccess: () => {
      void ctx.subEcho.getSubEchoByName.invalidate()
      toggleEditDescription()
    }
  })
  const toggleEditDescription = () => {
    if(descRef.current) descRef.current.focus()
    setEditDescription(!editDescription)
  }
  const editButton = () => {
    if (!user || user.id !== authorId) return null
    if (editDescription) {
      return (
        <div className="flex w-full space-x-4">
          <button onClick={toggleEditDescription} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-5 py-1 mr-2 mb-2" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : "Cancel"}</button> 
          <button onClick={() => mutate({ description: descRef?.current && descRef.current.value || description, echoId: id })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 mr-2 mb-2" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : "Save"}</button> 
        </div>
      )
    } else {
      return (
        <div className="flex w-full space-x-4">
          <button className="focus:outline-none text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-lg px-5 py-1 mr-2 mb-2" onClick={toggleEditDescription}>Edit </button>
        </div>
      )
    }
  }
  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">{`e/${title}`}</h3>
      <div className="flex h-56">
      <Textarea inputRef={descRef} disabled={!editDescription} />
      </div>
      {editButton()}
      <div className="flex flex-row space-x-3">
        {numPosts ? <span className="font-normal italic text-lg text-slate-400">{numPosts} posts</span> : null}
      </div>
    </div>
  )
}
const EchoPage: NextPage<{ name: string }> = ({ name }) => {
  const { data, isLoading } = api.subEcho.getSubEchoByName.useQuery({ name })
  // move logic for sorting to custom hook
  const [orderKey, setOrderKey,] = useState<string>('createdAt')
  const [orderVal, setOrderVal] = useState<string>('desc')
  // const [pagePosts, setPosts,] = useState<PostWithUser[]>([])
  const { data: posts, isLoading: postsLoading } = api.posts.getPostsByEchoId.useQuery({ echoId: data?.id || '', sortKey: orderKey, sortValue: orderVal })

  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
          <h1 className="font-bold text-2xl">{data.title}</h1>
          <div className="flex flex-row space-x-2">

            <button onClick={() => { setOrderVal('asc'); setOrderKey('likes') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Least Liked First</button>
            <button onClick={() => { setOrderVal('desc'); setOrderKey('likes') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Most Liked First</button>
            <button onClick={() => { setOrderVal('asc'); setOrderKey('createdAt') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Oldest First</button>
            <button onClick={() => { setOrderVal('desc'); setOrderKey('createdAt') }} className="bg-slate-500 rounded p-2 text-lg font-semibold">Newest First</button>
          </div>
          <div className="block md:hidden">
          <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={{ pathname: '/new', query: { echoName: name } }}>Create Post</Link>
            {/* <CreatePostWizard currentEchoName={data.title} /> */}
          </div>
          <div className="flex flex-col">

            {
              !postsLoading ? posts?.map((post) => <Post key={post.id} {...post} />) : <LoadingPage />
            }
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3">
          <SideBar echo={data} numPosts={posts?.length || 0}/>
          <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={{ pathname: '/new', query: { echoName: name } }}>Create Post</Link>
          {/* <CreatePostWizard currentEchoName={data.title} /> */}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const name = context.params?.name;

  if (typeof name !== "string") throw new Error("no slug");

  await ssg.subEcho.getSubEchoByName.prefetch({ name })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      name,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default EchoPage