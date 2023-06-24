import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import { api, RouterOutputs } from "~/utils/api"
import toast from "react-hot-toast";
import { EchoButton } from "./molecules";
import { usePost } from "~/hooks";


type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const Post = (props: PostWithUser) => {
  const { likePost, likeLoading } = usePost({postId: props.id})

  const { user } = useUser()
  const ctx = api.useContext()

  const postLikedByUser = () => {
    return !!props.likes.find((like) => like.userId === user?.id)
  }
  const likePostOnClick = () => {
    if (!user) toast.error("You need to sign in to echo a post!")
    else likePost({ postId: props.id })
  }
  return (
    <div className="flex flex-row p-8 border-b border-slate-400 p-4 gap-3">

      <div className="flex flex-col gap-3 w-5/6">
        <Link href={props.url ? props.url : `/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`} target={props.url ? "_blank" : "_self"}>
          <span className="font-bold text-4xl">{props.title}</span>
        </Link>
        <span className="font-semibold text-sm">
          {props.description}
        </span>
        <div className="flex flex-row space-x-4">
          <Link href={`/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline">{props.comments.length} comments</span></Link>
          <Link href={`/echo/${props?.echoName ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline">{`e/${props?.echoName || ''}`}</span></Link>
          <span className="text-slate-500 italic font-semibold underline">{`@/${props.user.username}`}</span>
        </div>
      </div>
      <div className="flex w-1/6 flex-col">
        <EchoButton postLikedByUser={postLikedByUser()} likePost={likePostOnClick} isLoading={likeLoading} likes={props.likes.length} />
      </div>
    </div>
  )
}