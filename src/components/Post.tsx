import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image";

import { api, RouterOutputs } from "~/utils/api"
import toast from "react-hot-toast";
import { EchoButton } from "./molecules";
import { usePost } from "~/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


type PostWithUser = RouterOutputs["posts"]["getAll"][number]


export const Post = (props: PostWithUser) => {
  // pass these fields into the POST card so we don't invoke the get post by ID call every card (might be causing too many callbacks error)
  const { likePost, likeLoading, deletePost } = usePost({ postId: props.id })

  const { user } = useUser()
  const ctx = api.useContext()
  const postLikedByUser = () => {
    return !!props.likes.find((like) => like.userId === user?.id)
  }
  const likePostOnClick = () => {
    if (!user) toast.error("You need to sign in to like a post!")
    else likePost({ postId: props.id })
  }
  const PostLink = () => {
    return (
      <Link href={props.url} className="flex w-5 ml-4" target={'_blank'}>
  
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </Link>
    )
  }
  return (
    <div className="flex flex-col rounded border-b border-slate-400 p-4">

      {props.metadata?.imageUrl && (
        <Link href={props.url} target={"_blank"} className="h-48 sm:h-80 w-full overflow-hidden">
          <img src={props.metadata?.imageUrl.toString()} alt="Post title" className="rounded-t-lg w-full" />
        </Link>
      )}
      <div className="flex flex-row gap-3 p-3">

        <div className="flex flex-col gap-3 w-5/6">
          <Link href={`/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`}>
            <span className="flex font-bold text-4xl">{props.title} {props.url && !props.metadata?.imageUrl && <PostLink />}</span>
          </Link>
          <div className="flex text-sm font-thin space-x-3 align-middle"><Image alt="profile image" src={props.user.profileImageUrl} width={56} height={56} className="h-8 w-8 rounded-full" /><span className="inline-block align-middle font-bold">{props.user.username}</span><span className="font-thin">{` · ${dayjs(props.createdAt).fromNow()}`}</span></div>
          <span className="font-semibold text-sm">
            {props.description}
          </span>
          <div className="flex flex-row space-x-4">
            <Link href={`/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline hover:cursor-pointer">{props.comments.length} comments</span></Link>
            <Link href={`/echo/${props?.echoName ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline hover:cursor-pointer">{`e/${props?.echoName || ''}`}</span></Link>
            {user && user.id === props.authorId && <span className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={() => deletePost({id: props.id})}>Delete</span>}
          </div>
        </div>
        <div className="flex w-1/6 flex-col">
          <EchoButton postLikedByUser={postLikedByUser()} likePost={likePostOnClick} isLoading={likeLoading} likes={props.likes.length} />
        </div>
      </div>
    </div>
  )
}