import React from 'react'
import { useUser } from "@clerk/nextjs"
import { LoadingSpinner } from '../loading'
import type { Like, Dislike } from "@prisma/client";
import { usePost } from '~/hooks';
import toast from "react-hot-toast";
import { RouterOutputs } from "~/utils/api"

type PostWithUser = RouterOutputs["posts"]["getAll"][number]



export const EchoButton = (props: PostWithUser) => {
  const { likes, dislikes, id } = props
  const { user } = useUser()
  const { likePost, likeLoading, dislikePost, dislikeLoading } = usePost({})

  const postLikedByUser = !!likes.find((like) => like.userId === user?.id)
  const postDislikedByUser = !!dislikes.find((dislike) => dislike.userId === user?.id)

  const likePostOnClick = () => {
    if (!user) toast.error("You need to sign in to like a post!")
    else likePost({ postId: id })
  }

  const dislikePostOnClick = () => {
    if (!user) toast.error("You need to sign in to like a post!")
    else dislikePost({ postId: id })
  }

  const likeDisplayIcon = () => {
    if (likeLoading) {
      return (
        <div className="flex justify-center h-8 align-center">
          <LoadingSpinner />
        </div>
      )
    }
    if (postLikedByUser) {
      return (
        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
        </svg>
      )
    }
    return (
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  const dislikeDisplayIcon = () => {
    if (dislikeLoading) {
      return (
        <div className="flex justify-center h-8 align-center">
          <LoadingSpinner />
        </div>
      )
    }
    if (postDislikedByUser) {
      return (
        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.905 12.75a1.25 1.25 0 01-2.5 0v-7.5a1.25 1.25 0 112.5 0v7.5zM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 015.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.242 0-2.26-1.01-2.146-2.247.193-2.08.652-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 011.342.317l2.733 1.366A3 3 0 0013.613 5h1.292v7h-.963c-.684 0-1.258.482-1.612 1.068a4.012 4.012 0 01-2.165 1.73c-.433.143-.854.386-1.012.814-.16.432-.248.9-.248 1.388z" />
        </svg>
      )
    }
    return (
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <div className='flex w-fit flex-col'>
      <div className="flex flex-row space-x-2">

      <button className={`w-6 ${postLikedByUser ? 'text-yellow-500' : 'text-slate-500'}`} onClick={likePostOnClick} disabled={likeLoading}>
        {likeDisplayIcon()}
      </button>
      <button className={`w-6 ${postDislikedByUser ? 'text-red-500' : 'text-slate-500'}`} onClick={dislikePostOnClick} disabled={dislikeLoading}>
        {dislikeDisplayIcon()}
      </button>
      </div>
      <span className="font-semibold text-sm">{`Score: ${likes.length - dislikes.length}`}</span>
    </div>
  )
}
