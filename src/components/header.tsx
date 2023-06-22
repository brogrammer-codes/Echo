import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { api } from '~/utils/api'


export const Header = () => {
  const { isSignedIn, user } = useUser()
  const { data: subEchos } = api.subEcho.getHeaderEcho.useQuery()

  return (
    <nav className='bg-slate-600 border-grey-200'>
      <div className="flex max-w-screen-xl flex-wrap items-center justify-between mx-auto p-4">
        <Link className='text-3xl font-bold' href={'/'}>

          {user && user.username ? `Welcome, ${user.username}` : `Welcome to Echo`}
        </Link>
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
      </div>
      <div className='flex flex-row space-x-5 text-lg'>
        {subEchos?.map((echo) => <Link key={echo.id} href={`/echo/${echo.title}`}>{echo.title}</Link>)}
      </div>
    </nav>
  )
}