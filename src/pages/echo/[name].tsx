import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import { CreatePostWizard } from "~/components/createPostWizard";

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
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  const { data: posts, isLoading: postsLoading } = api.posts.getPostsByEchoId.useQuery({ echoId: data.id })
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
          <h1 className="font-bold text-2xl">{data.title}</h1>
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