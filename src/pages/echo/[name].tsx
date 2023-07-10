import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RichText } from "~/components/atoms";
import Link from "next/link";
import { SortPostBar } from "~/components/SortPostBar";
import { SortOrderVal } from "~/utils/enums";


type SubEcho = RouterOutputs["subEcho"]["getSubEchoByName"]
interface SideBarProps {
  echo: SubEcho;
  numPosts: number
}
const SideBar = ({ echo, numPosts }: SideBarProps) => {
  const { id, title, description, authorId } = echo
  const { user } = useUser()
  const ctx = api.useContext()
  const [editDescription, setEditDescription] = useState<boolean>(false)
  const [descriptionState, setDescriptionState] = useState<string>(description)

  useEffect(() => {
    setDescriptionState(description)
  }, [description])

  const { mutate, isLoading } = api.subEcho.updateSubEcho.useMutation({
    onSuccess: () => {
      void ctx.subEcho.getSubEchoByName.invalidate()
      toggleEditDescription()
    }
  })
  const toggleEditDescription = () => {
    !editDescription && setDescriptionState(description)
    setEditDescription(!editDescription)
  }
  const editButton = () => {
    if (!user || user.id !== authorId) return null
    if (editDescription) {
      return (
        <div className="flex w-full space-x-4">
          <button onClick={toggleEditDescription} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-5 py-1 mr-2 mb-2" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : "Cancel"}</button>
          <button onClick={() => mutate({ description: descriptionState, echoId: id })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 mr-2 mb-2" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : "Save"}</button>
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
      <div className="flex h-auto">
        <RichText value={descriptionState} setValue={setDescriptionState} edit={editDescription} preview={!editDescription} />
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
  const [orderKey, setOrderKey,] = useState<SortOrderVal>(SortOrderVal.CREATED_ASC)
  const { data: posts, isLoading: postsLoading } = api.posts.getPostsByEchoId.useQuery({ echoId: data?.id || '', sortKey: orderKey })
  const { user } = useUser()

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
          <SortPostBar order={orderKey} setOrder={setOrderKey} />
          <div className="block sm:hidden my-3 p-2">
            {user && <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={{ pathname: '/new', query: { echoName: name } }}>Create Post</Link>}
          </div>
          <div className="flex flex-col">

            {
              !postsLoading ? posts?.map((post) => <Post key={post.id} {...post} />) : <LoadingPage />
            }
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3">
          <SideBar echo={data} numPosts={posts?.length || 0} />
          {user && <Link className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" href={{ pathname: '/new', query: { echoName: name } }}>Create Post</Link>}
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