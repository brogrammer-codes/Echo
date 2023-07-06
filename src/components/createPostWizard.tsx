import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Button, Input, RichText, Textarea } from "~/components/atoms";
import { api, RouterOutputs } from "~/utils/api"
import { usePost } from "~/hooks";
import { LoadingPage } from "./loading";
import { useRouter } from 'next/router';

interface CreatePostWizardProps {
  currentEchoName?: string;
  postUrl?: string;
}
type UrlMetadata = RouterOutputs["posts"]["getMetadataFromUrl"]
export const CreatePostWizard = (props: CreatePostWizardProps) => {
  const router = useRouter()

  const { user } = useUser()
  const postTitle = useRef<HTMLInputElement>(null)
  const postUrl = useRef<HTMLInputElement>(null)
  const [description, setDescription] = useState<string>('')

  const postDescription = useRef<HTMLTextAreaElement>(null)
  const postEcho = useRef<HTMLInputElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { createPost, createPostLoading } = usePost({ onCreatePostSuccess: (echoName, id) => router.push(`/echo/${echoName}/comments/${id}`) })
  const { mutate: getUrlMetadata } = api.posts.getMetadataFromUrl.useMutation({
    onSuccess: (metadata: UrlMetadata) => {
      if (metadata) {
        if (postTitle.current && postTitle.current?.value === '' && metadata.title) {
          postTitle.current.value = metadata.title
        }
        if (postDescription.current && description === '' && metadata.description) {
          setDescription(metadata.description)
        }
      }
    }
  })

  if (!user) return <LoadingPage />
  const getUrlMetadataOnBlur = () => {
    if (postUrl?.current) {
      getUrlMetadata({ url: postUrl?.current.value })
    }
  }
  const submitForm = () => {
    const echoName = props.currentEchoName || (postEcho.current && postEcho.current.value) || ''
    if (postTitle.current && postUrl.current) {
      createPost({ title: postTitle.current.value, url: postUrl.current.value, echo: echoName, description })
    }

  }
  return (
    <div className="flex w-full gap-3 m-2 p-1">
      <div className="w-full">
        <div className="block flex flex-col space-y-3 w-full">
          <span>Post title</span>
          <Input inputRef={postTitle} placeholder="Check out this neat post about..." />
          <span>URL you are sharing a link</span>
          <Input inputRef={postUrl} placeholder="Post URL" onBlur={getUrlMetadataOnBlur} />
          {/* <Textarea inputRef={postDescription} placeholder="Post Description" /> */}
          <div className="flex w-full h-auto flex-col">
            {/* better logic for button flipping state */}
            <button onClick={() => setShowPreview(!showPreview)}>Show Preview</button>
            <RichText value={description} setValue={setDescription} edit preview={showPreview} />
          </div>
          {props.currentEchoName ? `Echo Space: ${props.currentEchoName}` : <Input inputRef={postEcho} placeholder="Echo Name" />}
          <Button buttonText="Submit Post" onClick={submitForm} disabled={createPostLoading} />
        </div>
      </div>
    </div>
  )
}