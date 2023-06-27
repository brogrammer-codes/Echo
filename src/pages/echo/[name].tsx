import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import { CreatePostWizard } from "~/components/createPostWizard";
import { useEffect, useState } from "react";
import dayjs from "dayjs";


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const sideBar = (title: string, description: string, numPosts: number,) => {

  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">{`e/${title}`}</h3>
      <span className="font-normal text-lg text-slate-400">{description} </span>
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
  const [pagePosts, setPosts,] = useState<PostWithUser[]>([])
  const { data: posts, isLoading: postsLoading } = api.posts.getPostsByEchoId.useQuery({ echoId: data?.id || '' })
  useEffect(() => {
    posts && setPosts([...posts])
  }, [posts])
  useEffect(() => {
    const newPosts = pagePosts
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
              !postsLoading ? pagePosts?.map((post) => <Post key={post.id} {...post} />) : <LoadingPage />
            }
          </div>
        </div>
        <div className="hidden md:flex flex-col w-1/3">
          {sideBar(data.title, data.description, posts?.length || 0)}
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