import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image";

import { RouterOutputs } from "~/utils/api"
import toast from "react-hot-toast";
import { EchoButton } from "./molecules";
import { usePost } from "~/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { LoadingSpinner } from "./loading";
import RichTextDisplay from "./atoms/richTextDisplay";
dayjs.extend(relativeTime);


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

interface PostCardProps extends PostWithUser{
  showDescription?: boolean
}

export const Post = (props: PostCardProps) => {
  // pass these fields into the POST card so we don't invoke the get post by ID call every card (might be causing too many callbacks error)
  const { likePost, likeLoading, deletePost, deleteLoading } = usePost({})
  const [showDescription, setShowDescription] = useState<boolean>(props.showDescription || false)

  const { user } = useUser()
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
  const DeleteButton = () => {
    const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false)
    if (!user || user.id !== props.authorId) return null
    const toggleDeleteOption = () => {
      setShowDeleteOption((option) => !option)
    }
    const deletePostOnClick = () => {
      deletePost({ id: props.id })
    }
    if(deleteLoading) return <div className="flex w-8 items-center"><LoadingSpinner /></div>
    if (showDeleteOption) {
      return (
        <div className="flex flex-row space-x-2">
          <span className="text-slate-500 italic font-semibold">Are you sure?</span>
          <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={deletePostOnClick}>Yes</button>
          <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={toggleDeleteOption}>Cancel</button>
        </div>
      )
    }
    return (
      <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={toggleDeleteOption}>Delete</button>
    )
  }
  return (
    <div className="flex flex-col p-4">

      {props.metadata?.imageUrl && (
        <Link href={props.url} target={"_blank"} className="h-48 md:h-80 w-full overflow-hidden">
          <img src={props.metadata?.imageUrl.toString()} alt="Post title" className="rounded-t-lg w-full" />
        </Link>
      )}
      <div className="flex flex-row gap-3 bg-slate-900 rounded p-5">

        <div className="flex flex-col gap-3 w-5/6">
          <div className="flex text-sm font-thin space-x-3 items-center">{props.user.profileImageUrl && <Image alt="profile image" src={props.user.profileImageUrl} width={56} height={56} className="h-8 w-8 rounded-full" />}<span className="inline-block align-middle font-bold">{props.user.username}</span><span className="font-thin">{` · ${dayjs(props.createdAt).fromNow()}`}</span></div>
          <div className="flex space-x-2">

          <Link href={`/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`}>
            <span className="flex font-bold text-4xl">{props.title} </span>
          </Link>
          {props.url && !props.metadata?.imageUrl && <PostLink />}
          </div>
          <span>
            {!showDescription ? <button className="bg-slate-600 rounded italic p-1 px-2 font-semibold text-lg" onClick={() => setShowDescription(true)}>Show description... </button> : null}
            {showDescription && <RichTextDisplay value={props.description}/>}
            {showDescription ? <button className="bg-slate-600 rounded italic p-1 px-2 font-semibold" onClick={() => setShowDescription(false)}>Hide description... </button> : null}
          </span>
          <div className="flex flex-row space-x-4">
            <Link href={`/echo/${props?.echoName ?? ''}/comments/${props?.id ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline hover:cursor-pointer">{props.comments.length} comments</span></Link>
            <Link href={`/echo/${props?.echoName ?? ''}`} target="_blank"><span className="text-slate-500 italic font-semibold underline hover:cursor-pointer">{`e/${props?.echoName || ''}`}</span></Link>
            <DeleteButton />
          </div>
        </div>
        <div className="flex w-1/6 flex-col">
          <EchoButton postLikedByUser={postLikedByUser()} likePost={likePostOnClick} isLoading={likeLoading} likes={props.likes.length} />
        </div>
      </div>
    </div>
  )
}