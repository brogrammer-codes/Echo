import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import Link from "next/link";
import { Button, Textarea } from "~/components/atoms";
import { useCallback, useRef, useState } from "react";
import toast, { ToastIcon } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { EchoButton } from "~/components/molecules";
import { usePost } from "~/hooks";
import { CreateCommentWizard } from "~/components/createCommentWizard";
import { DisplayCommentTree } from "~/components/commentTree";
dayjs.extend(relativeTime);


const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const { post, postLoading, addComment, commentLoading, likePost, likeLoading } = usePost({ postId: id, onCommentSuccess: () => { toast.success("Comment posted!") } })
  const { user } = useUser()


  if (postLoading) return <LoadingPage />
  if (!post) return <div>Could not load Post</div>
  const { data: echo } = api.subEcho.getSubEchoById.useQuery({ id: post.echoId })


  const submitPostComment = (content: string, parentId: string | undefined = undefined) => {
    addComment({ postId: id, content, parentCommentId: parentId })
  }
  const likePostOnClick = () => {
    if (!user) toast.error("You need to sign in to echo a post!")
    else likePost({ postId: id })
  }


  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full md:w-2/3 p-2">
          <Post {...post}/>
          <CreateCommentWizard submitComment={submitPostComment} commentLoading={commentLoading} />
          <div className="flex flex-col">

            {
              post.comments.length ? !postLoading ? <DisplayCommentTree comments={post.comments} parentId={null} indent={0} submitPostComment={submitPostComment} /> : <LoadingPage /> : null
            }
          </div>
        </div>
        <div className="hidden md:flex w-1/3 flex-col space-y-2">
          <span>{`Post has ${post.likes.length} likes`}</span>
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