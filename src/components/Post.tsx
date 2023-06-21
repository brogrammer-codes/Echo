import Link from "next/link"
import { useState } from "react"

export const Post = () => {
    const [likedPost, setLikedPost] = useState<boolean>(false)
    return (
      <div className="flex flex-row p-8 border-b border-slate-400 p-4 gap-3">
  
        <div className="flex flex-col gap-3 w-5/6">
            <Link href={'https://create.t3.gg/en/introduction'} target="_blank">
          <span className="font-bold text-4xl">The best way to start a full-stack, typesafe Next.js app</span>
            </Link>
          <span className="font-semibold text-sm">
            The “T3 Stack” is a web development stack made by Theo↗ focused on simplicity, modularity, and full-stack typesafety.
  
            The core pieces are Next.js↗ and TypeScript↗. Tailwind CSS↗ is almost always included. If you’re doing anything resembling backend, tRPC↗, Prisma↗, and NextAuth.js↗ are great additions too.
          </span>
          <div className="flex flex-row space-x-4">
            <span className="text-slate-500 italic font-semibold underline">6 comments</span>
            <span className="text-slate-500 italic font-semibold underline">e/tech</span>
            <span className="text-slate-500 italic font-semibold underline">@user</span>
          </div>
        </div>
        <div className="flex w-1/6 flex-col">
          <button className={`w-10 ${likedPost ? 'text-yellow-500' : 'text-slate-500'}`} onClick={() => setLikedPost(!likedPost)}>
            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span className="font-semibold">6 echos</span>
          
        </div>
      </div>
    )
  }