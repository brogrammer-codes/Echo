import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { usePost } from "~/hooks";
import { CreateCommentWizard } from "~/components/createCommentWizard";
import { DisplayCommentTree } from "~/components/commentTree";
import RichTextDisplay from "~/components/atoms/richTextDisplay";
dayjs.extend(relativeTime);

const sideBar = (title: string, description: string, likes: number,) => {

  return (
    <div className="flex flex-col space-y-3 py-4 px-2">

      <h3 className="font-bold text-2xl text-slate-300">{`e/${title}`}</h3>
      <span className="font-normal text-lg text-slate-400"><RichTextDisplay value={description}/> </span>
      <div className="flex flex-row space-x-3">

        {likes ? <span className="font-normal italic text-lg text-slate-400">{likes} Likes</span> : null}
      </div>
    </div>
  )
}
const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { post, postLoading, addComment, commentLoading, deleteComment, likeLoading } = usePost({ postId: id, onCommentSuccess: () => { toast.success("Comment posted!") } })
  const { user } = useUser()


  if (postLoading) return <LoadingPage />
  if (!post) return <div>Could not load Post</div>
  const { data: echo } = api.subEcho.getSubEchoById.useQuery({ id: post.echoId })


  const submitPostComment = (content: string, parentId: string | undefined = undefined) => {
    addComment({ postId: id, content, parentCommentId: parentId })
  }

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
          <Post {...post} />
          <CreateCommentWizard submitComment={submitPostComment} commentLoading={commentLoading} />
          <div className="flex flex-col">

            {
              post.comments.length ? !postLoading ? <DisplayCommentTree comments={post.comments} parentId={null} indent={0} submitPostComment={submitPostComment} deleteComment={(commentId) => deleteComment({id:commentId})}/> : <LoadingPage /> : null
            }
          </div>
        </div>
        <div className="hidden md:flex w-1/3 flex-col space-y-2">
          {sideBar(echo?.title || '', echo?.description || '', post.likes.length)}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  await ssg.posts.getPostById.prefetch({ id })

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