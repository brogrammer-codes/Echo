import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import Link from "next/link";
import { Button, Textarea } from "~/components/atoms";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

type PostComments = RouterOutputs['posts']['getPostsById'][number]['comments']
const CommentNode = (props: {comments: PostComments, comment: PostComments[0]}) => {
  const childComments = props.comments.filter((c) => c.parentCommentId === props.comment.parentCommentId)
  return (
    <div className="flex">

    </div>
  )
}
const CommentTree = (props: PostComments) => {
  if(props && props.length) {
    const rootComments = props.filter((comment) => !comment.parentCommentId)
    return (
      <div className="flex w-full">
        {
          rootComments.map((root) => <CommentNode comment={root} comments={props}/>)
        }
      </div>
    )
  }
  // return props.map((comment) => <span key={comment.id}>{comment.content}</span>)
}

function displayCommentTree(comments: PostComments, parentId:string | null = null, indent = 0) {
  const parentComments = comments.filter((comment) => comment.parentCommentId === parentId);
  
  return (
    <ul className={`ml-${indent} p-1`}>
      {parentComments.map((comment) => {
        const { id, content, authorId } = comment;

        return (
          <li key={id} className="mb-4">
            <div className="bg-slate-950 p-2 rounded">
              <p>{content}</p>
              <span>Reply</span>
            </div>
            {displayCommentTree(comments, id, indent + 1)}
          </li>
        );
      })}
    </ul>
  );
}

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostsById.useQuery({ id })
  const { user } = useUser()
  const post = data && data.length ? data[0] : null
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const ctx = api.useContext()
  if (isLoading) return <LoadingPage />
  if (!post) return <div>Could not load Post</div>
  const { data: echo } = api.subEcho.getSubEchoById.useQuery({ id: post.echoId })
  const { mutate } = api.posts.addComment.useMutation({
    onSuccess: () => {
      if (commentRef?.current?.value) commentRef.current.value = ''
      void ctx.posts.getPostsById.invalidate()
    },
    onError: () => {
      toast.error("Could not post comment")
    }
  })
  const PostLink = () => {
    return (
      <Link href={post.url} className="flex w-5 ml-4" target={'_blank'}>

        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </Link>
    )
  }
  const submitPostComment = (parentId: string | undefined = undefined) => {
    if(commentRef.current) {
      mutate({postId: id, content: commentRef.current.value, parentCommentId: parentId})
    }
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
          {user && (
            <div>
              <Textarea inputRef={commentRef} />
              <Button buttonText="Submit Comment" onClick={() => submitPostComment()}/>
            </div>
          )}
          <div className="flex flex-col">

            {
              !isLoading ? displayCommentTree(post.comments) : <LoadingPage />
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