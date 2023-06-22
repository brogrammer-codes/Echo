import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";


const EchoPage: NextPage<{ name: string }> = ({name}) => {
  const { data, isLoading } = api.subEcho.getSubEchoByName.useQuery({ name })
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  const {data: posts, isLoading: postsLoading} = api.posts.getPostsByEchoId.useQuery({echoId: data.id})
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
        <h1 className="font-bold text-2xl">{data.title}</h1>
        <div className="flex flex-col">

        {
          !postsLoading ? posts?.map((post) => <Post key={post.id} {...post}/>) : <LoadingPage />
        }
        </div>
        </div>
        <div className="hidden md:flex w-1/3">
          {data.description}
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