import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button, Input, Textarea } from "~/components/atoms";
import toast from "react-hot-toast";
import dayjs from "dayjs";

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
      let title = errorMessage?.title
      let description = errorMessage?.echo
      if(e.message) toast.error(e.message)
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
    <div className="flex flex-col sm:flex-row gap-3 m-2 p-1 w-full sm:w-1/2">
      <button className="text-xl font-bold bg-slate-400 rounded p-1 my-2 h-10 md:w-1/2" onClick={() => setShowInputForm(!showInputForm)}>{!showInputForm ? 'Create Echo' : 'Hide'}</button>
      {showInputForm && (<div className="block flex flex-col space-y-3 w-full p-4">
        <Input inputRef={echoTitle} placeholder="Echo Title" />
        <Textarea inputRef={echoDescription} placeholder="Echo Description" />
        <Button buttonText="Submit Post" onClick={submitForm} />
      </div>)}
    </div>
  )
}

export default function Home() {
  const { data, isLoading } = api.subEcho.getAll.useQuery()
  console.log(isLoading, data);
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load Echos</div>
  return (
    <div className="flex flex-col">
      <EchoSpaceCreateWizard />
      {
        data.map((echo) => (
          <Link href={`/echo/${echo.title}`}>
            <div className="flex flex-col p-2 m-1 bg-slate-800 rounded hover:cursor-pointer space-y-2">
              <span key={echo.id} className="font-bold text-2xl">e/{echo.title}</span>
              <span key={echo.id} className="font-medum text-lg">{echo.description}</span>
              <span className="text-sm italic">{`Created: ${dayjs(echo.createdAt).format('DD/MM/YYYY')}`}</span>
            </div>
          </Link>
        ))
      }
    </div>
  );
}
