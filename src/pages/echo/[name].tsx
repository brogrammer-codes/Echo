import { LoadingPage } from "~/components/loading";
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


type SubEcho = RouterOutputs["subEcho"]["getSubEchoByName"]

const sideBar = (echo: SubEcho, numPosts: number) => {
  const {user} = useUser()
  const ctx = api.useContext()
  const [editDescription, setEditDescription] = useState<boolean>(false)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const {id, title, description, authorId} = echo
  useEffect(() => {
    if(descRef.current) descRef.current.value = description
  }, [])
  
  const {mutate} = api.subEcho.updateSubEcho.useMutation({
    onSuccess: () => {
     void ctx.subEcho.getSubEchoByName.invalidate()
     toggleEditDescription()
    }
  })
  const toggleEditDescription = () => {
    setEditDescription(!editDescription)
    // descRef?.current.value = echo.description
  }
  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">{`e/${title}`}</h3>
      <Textarea inputRef={descRef} disabled={!editDescription}/>
      {user && user.id === authorId ? (editDescription ? <div><button onClick={toggleEditDescription}>Cancel</button> <button onClick={() => mutate({description:  descRef?.current && descRef.current.value ||description , echoId: id})}>Save</button> </div> : <button onClick={toggleEditDescription}>Edit </button>) : null}
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
  const [orderVal, setOrderVal] = useState<string>('asc')
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

            <CreatePostWizard currentEchoName={data.title} />
          </div>
          <div className="flex flex-col">

            {
              !postsLoading ? posts?.map((post) => <Post key={post.id} {...post} />) : <LoadingPage />
            }
          </div>
        </div>
        <div className="hidden md:flex flex-col w-1/3">
          {sideBar(data, posts?.length || 0)}
          <CreatePostWizard currentEchoName={data.title} />
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