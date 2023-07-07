import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button, Input, Textarea } from "~/components/atoms";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import RichTextDisplay from "~/components/atoms/richTextDisplay";

const EchoSpaceCreateWizard = () => {
  const { user } = useUser()
  const echoTitle = useRef<HTMLInputElement>(null)
  const echoDescription = useRef<HTMLTextAreaElement>(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const ctx = api.useContext()
  const { mutate } = api.subEcho.create.useMutation({
    onSuccess: () => {
      void ctx.subEcho.getAll.invalidate();
      setShowInputForm(false)
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors
      const title = errorMessage?.title
      const description = errorMessage?.echo
      if (e.message) toast.error(e.message)
      if (title && title[0]) {
        toast.error(title[0])

      } if (description && description[0]) {
        toast.error(description[0])
      }
    }
  })
  if (!user) return null
  const submitForm = () => {
    if (echoTitle?.current && echoDescription?.current) mutate({ title: echoTitle.current.value, description: echoDescription.current.value })

  }
  return (
    <div className="flex gap-3 m-2 p-1">
      <div className="w-full">
        <button className="text-2xl font-bold bg-slate-400 w-full rounded p-1 my-2" onClick={() => setShowInputForm(!showInputForm)} >{showInputForm ? "Hide" : "Create Echo Space"}</button>
        {showInputForm && (<div className="block flex flex-col space-y-3 w-full">
        <Input inputRef={echoTitle} placeholder="Echo Title" />
        <Textarea inputRef={echoDescription} placeholder="Echo Description" />
        <Button buttonText="Submit Post" onClick={submitForm} />
        </div>)}
      </div>
    </div>
  )

}

export default function Home() {
  const { data, isLoading } = api.subEcho.getAll.useQuery()
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load Echos</div>
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 p-2">
        <div className="block md:hidden">

          <EchoSpaceCreateWizard />
        </div>
        {
          data.map((echo) => (
            <Link key={echo.id} href={`/echo/${echo.title}`}>
              <div className="flex flex-col p-2 m-1 bg-slate-800 rounded hover:cursor-pointer space-y-2">
                <span className="font-bold text-2xl">e/{echo.title}</span>
                <span className="font-medum text-lg"><RichTextDisplay value={echo.description}/></span>
                <span className="text-sm italic">{`Created: ${dayjs(echo.createdAt).format('DD/MM/YYYY')}`}</span>
              </div>
            </Link>
          ))
        }
      </div>
      <div className="hidden md:flex flex-col w-1/3">
        <h3>Create a new Echo Space</h3>
        <EchoSpaceCreateWizard />
      </div>
    </div>
    // <div className="flex flex-col">
    //   <EchoSpaceCreateWizard />

    // </div>
  );
}
