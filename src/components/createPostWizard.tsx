import { useUser } from "@clerk/nextjs";
import { useRef, useState, useEffect } from "react";
import { Button, Input, RichText } from "~/components/atoms";
import { api, type RouterOutputs } from "~/utils/api"
import { usePost } from "~/hooks";
import { LoadingPage } from "./loading";
import { useRouter } from 'next/router';
import { SubEchoSearch } from "./molecules";

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
  const [postEcho, setPostEcho] = useState<string>(props.currentEchoName || '')
  // let postEcho: string = props.currentEchoName || ''
  const [showPreview, setShowPreview] = useState(false)
  const routeToPost = (echoName: string, id: string) => {
    router.push(`/echo/${echoName}/comments/${id}`).catch(() => null)
  }
  const { createPost, createPostLoading } = usePost({ onCreatePostSuccess: (echoName, id) => routeToPost(echoName, id) })
  const { mutate: getUrlMetadata } = api.posts.getMetadataFromUrl.useMutation({
    onSuccess: (metadata: UrlMetadata) => {
      if (metadata) {
        if (postTitle.current && postTitle.current?.value === '' && metadata.title) {
          postTitle.current.value = metadata.title
        }
        if (description === '' && metadata.description) {
          setDescription(metadata.description)
        }
      }
    }
  })
  useEffect(() => {
    if(props.currentEchoName) setPostEcho(props.currentEchoName)
  }, [])
  
  useEffect(() => {
    if(props.postUrl && postUrl.current) {
      postUrl.current.value = props.postUrl
      getUrlMetadataOnBlur()
    }
  }, [props])
  
  if (!user) return <LoadingPage />

  const getUrlMetadataOnBlur = () => {
    if (postUrl?.current) {
      getUrlMetadata({ url: postUrl?.current.value })
    }
  }
  const togglePreview = () => {
    setShowPreview((prev) => !prev)
  }
  const submitForm = () => {
    if (postTitle.current && postUrl.current) {
      createPost({ title: postTitle.current.value, url: postUrl.current.value, echo: postEcho, description })
    }

  }
  return (
    <div className="flex w-full gap-3 m-2 p-1">
      <div className="w-full">
        <div className="flex flex-col space-y-3 w-full">
          <span>Post title</span>
          <Input inputRef={postTitle} placeholder="Check out this neat post about..." />
          <span>URL you are sharing a link</span>
          <Input inputRef={postUrl} placeholder="Post URL" onBlur={getUrlMetadataOnBlur} />
          <div className="flex w-full h-auto flex-col">
            <button onClick={togglePreview}>Show Preview</button>
            <RichText value={description} setValue={setDescription} edit preview={showPreview} />
          </div>
          {postEcho ? <div className="flex justify-between p-2"> {`Echo Space: ${postEcho}`} <button onClick={() => setPostEcho('')} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-lg px-4 py-1.5 mr-1.5 mb-1.5">Clear</button></div> : <SubEchoSearch selectEcho={(name) => setPostEcho(name)}/>}
          
          <Button buttonText={createPostLoading ? "Submitting Post..." : "Submit Post"} onClick={submitForm} disabled={createPostLoading} />
        </div>
      </div>
    </div>
  )
}