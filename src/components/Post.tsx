import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import { api, RouterOutputs } from "~/utils/api"
import toast from "react-hot-toast";


type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const Post = (props: PostWithUser) => {
  const { user } = useUser()
  const ctx = api.useContext()

  const {mutate, isLoading} = api.posts.likePost.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post")
      }
    }
  })
  const postLikedByUser = () => {
    return (props.likes.find((like) => like.userId === user?.id))
  }
  const likePost = () => {
    if(!user) toast.error("You need to sign in to echo a post!")
    else  mutate({postId: props.id})
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
        <button className={`w-10 ${postLikedByUser() ? 'text-yellow-500' : 'text-slate-500'}`} onClick={likePost} disabled={isLoading}>
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              strokeLinecap="round"
              strokeLinejoin="round">

            </path>
          </svg>
        </button>
        <span className="font-semibold">{props.likes.length} echos</span>

      </div>
    </div>
  )
}