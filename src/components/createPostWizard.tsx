import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Button, Input, RichText, Textarea } from "~/components/atoms";
import { api, RouterOutputs } from "~/utils/api"
import { usePost } from "~/hooks";

interface CreatePostWizardProps {
  currentEchoName?: string;
}
type UrlMetadata = RouterOutputs["posts"]["getMetadataFromUrl"]
export const CreatePostWizard = (props: CreatePostWizardProps) => {
  const { user } = useUser()
  const postTitle = useRef<HTMLInputElement>(null)
  const postUrl = useRef<HTMLInputElement>(null)
  const [description, setDescription] = useState<string>('')

  const postDescription = useRef<HTMLTextAreaElement>(null)
  const postEcho = useRef<HTMLInputElement>(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const {createPost, createPostLoading} = usePost({onCreatePostSuccess: () => setShowInputForm(false)})
  const {mutate: getUrlMetadata} = api.posts.getMetadataFromUrl.useMutation({
    onSuccess: (metadata: UrlMetadata) => {
      if(metadata) {
        if(postTitle.current && postTitle.current?.value === '' &&  metadata.title) {
          postTitle.current.value = metadata.title
        }
        if(postDescription.current && description === '' && metadata.description) {
          setDescription(metadata.description)
        }
      }
    }
  })

  if (!user) return null
  const getUrlMetadataOnBlur = () => {
    if(postUrl?.current){
      getUrlMetadata({url: postUrl?.current.value})
    }
  }
  const submitForm = () => {
    const echoName = props.currentEchoName || (postEcho.current && postEcho.current.value) || ''
    if (postTitle.current && postUrl.current) {
      createPost({ title: postTitle.current.value, url: postUrl.current.value, echo: echoName, description })
    }

  }
  return (
    <div className="flex gap-3 m-2 p-1">
      <div className="w-full">
        <button className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" onClick={() => setShowInputForm(!showInputForm)} disabled={createPostLoading}>{showInputForm ? "Hide" : "Create Post"}</button>
        {showInputForm && (<div className="block flex flex-col space-y-3 w-full">
          <Input inputRef={postTitle} placeholder="Post Title" />
          <Input inputRef={postUrl} placeholder="Post URL" onBlur={getUrlMetadataOnBlur}/>
          {/* <Textarea inputRef={postDescription} placeholder="Post Description" /> */}
          <RichText value={description} setValue={setDescription} edit preview/>
          {props.currentEchoName ? `Echo Space: ${props.currentEchoName}` :<Input inputRef={postEcho} placeholder="Echo Name" />}
          <Button buttonText="Submit Post" onClick={submitForm} disabled={createPostLoading}/>
        </div>)}
      </div>
    </div>
  )
}