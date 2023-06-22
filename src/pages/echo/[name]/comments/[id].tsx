import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import Link from "next/link";


const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostsById.useQuery({ id })
  const post = data && data.length ? data[0] : null
  if (isLoading) return <LoadingPage />
  if (!post) return <div>Could not load Post</div>
  const {data: echo } = api.subEcho.getSubEchoById.useQuery({id: post.echoId})
  const PostLink = () => {
    return (
      <Link href={post.url} className="flex w-5 ml-4" target={'_blank'}>
        
        <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </Link>
    )
  }
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
          <h1 className="flex font-bold text-2xl">{post.title} {post.url && <PostLink />}</h1>
          <span>{post.description}</span>
          <div className="flex flex-col">

            {
              !isLoading ? post.comments?.map((comment) => <span key={comment.id}>{comment.content}</span>) : <LoadingPage />
            }
          </div>
        </div>
        <div className="hidden md:flex w-1/3 flex-col space-y-2">
          <span>{`Post has ${post.likes.length} Echos`}</span>
          <span>Echo </span>
          <span>{echo?.title}</span>
          <span>{echo?.description}</span>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  // await ssg.subEcho.getSubEchoByName.prefetch({ name })
  await ssg.posts.getPostsById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage