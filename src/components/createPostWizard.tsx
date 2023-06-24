import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, Textarea } from "~/components/atoms";
import toast from "react-hot-toast";
import { typeToFlattenedError } from "zod";

const showZodError = (e: typeToFlattenedError<any, string>) => {
  const errorMessage = e.fieldErrors
  const title = errorMessage?.title
  const echo = errorMessage?.echo
  const description = errorMessage?.description
  const url = errorMessage?.url
  if (url && url[0]) {
    toast.error(url[0])
  } if(title && title[0]) {
    toast.error(title[0])
    
  } if(echo && echo[0]) {
    toast.error(echo[0])
    
  } if(description && description[0]) {
    toast.error(description[0])
  } 
  else {
    toast.error("Failed to post")
  }
}
interface CreatePostWizardProps {
  currentEchoName?: string;
}

export const CreatePostWizard = (props: CreatePostWizardProps) => {
  const { user } = useUser()
  const postTitle = useRef<HTMLInputElement>(null)
  const postUrl = useRef<HTMLInputElement>(null)
  const postDescription = useRef<HTMLTextAreaElement>(null)
  const postEcho = useRef<HTMLInputElement>(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const ctx = api.useContext()
  const { mutate } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getPostsByEchoId.invalidate()
      void ctx.posts.getAll.invalidate();
      setShowInputForm(false)
    },
    onError: (e) => {
      if (e.message) toast.error(e.message)
      const errorMessage = e.data?.zodError
      if (errorMessage) showZodError(errorMessage)
    }
  })
  if (!user) return null
  const submitForm = () => {
    const echoName = props.currentEchoName || (postEcho.current && postEcho.current.value) || ''
    if (postTitle.current && postUrl.current && postDescription.current) {
      mutate({ title: postTitle.current.value, url: postUrl.current.value, echo: echoName, description: postDescription.current.value })
    }

  }
  return (
    <div className="flex gap-3 m-2 p-1">
      <div className="w-full">
        <button className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" onClick={() => setShowInputForm(!showInputForm)}>{showInputForm ? "Hide" : "Show"} Input Form</button>
        {showInputForm && (<div className="block flex flex-col space-y-3 w-full">
          <Input inputRef={postTitle} placeholder="Post Title" />
          <Input inputRef={postUrl} placeholder="Post URL" />
          <Textarea inputRef={postDescription} placeholder="Post Description" />
          {props.currentEchoName ? `Echo Space: ${props.currentEchoName}` :<Input inputRef={postEcho} placeholder="Echo Name" />}
          <Button buttonText="Submit Post" onClick={submitForm} />
        </div>)}
      </div>
    </div>
  )
}