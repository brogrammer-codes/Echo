import { SignInButton, SignOutButton, useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api'


export const Header = () => {
  const { isSignedIn, user } = useUser()
  const { data: subEchos } = api.subEcho.getHeaderEcho.useQuery()
  const [navOpen, setNavOpen] = useState(false)
  const toggleNav = () => {
    setNavOpen((curNav) => !curNav)
  }
  const closeNav = () => {
    setNavOpen(false)
  }
  useEffect(() => {
    window.addEventListener('click', (e: Event) => {
      const navBar = document.getElementById('navBar');
      if(navBar && !navBar.contains(e.target as Node) && navOpen) {
        closeNav();
      }
    })
  })
  return (
    <nav className='bg-slate-600 border-grey-200' id='navBar'>
      <div className="flex max-w-screen-xl flex-wrap items-center justify-between mx-auto p-4">
        <Link className='text-lg md:text-3xl font-bold flex' href={'/'} onClick={closeNav}>

          Welcome to Echo <span className='block md:hidden'>{user && user.username && `, ${user.username}`}</span>
        </Link>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false" onClick={toggleNav}>
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </button>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <div className="flex flex-row space-x-4">

        <Link href={'/echo'} className="text-lg text-slate-50 font-bold">Echos</Link>
          {isSignedIn ? <UserButton appearance={{
            elements: {
              userButtonAvatarBox: {
                width: 45,
                height: 45,
                marginLeft: 2,
              },
              userButtonOuterIdentifier: 'text-lg text-slate-50 font-bold'
            }
            
          }} afterSignOutUrl="/" showName />  : <SignInButton />}
          </div>
        </div>
      </div>
      <div className='hidden md:flex flex-row space-x-5 text-lg px-3 py-1'>
        {subEchos?.map((echo) => <Link className='italic font-semibold underline hover:text-slate-200' key={echo.id} href={`/echo/${echo.title}`}>{echo.title}</Link>)}
      </div>
      {navOpen && (<div className='flex h-screen space-x-2 pb-10 justify-between'>
        <div className="flex flex-col px-1">
          {isSignedIn ? <UserButton appearance={{
            elements: {
              userButtonAvatarBox: {
                width: 45,
                height: 45,
                marginLeft: 2,
              },
              userButtonOuterIdentifier: 'text-lg text-slate-50 font-bold'
            }

          }} afterSignOutUrl="/" showName /> : <SignInButton />}
          <Link href={'/echo'} onClick={closeNav}>Echos</Link>
        </div>
        <div className='flex flex-col space-y-5 text-lg px-3 py-1'>
          <span>Echo List</span>
          {subEchos?.map((echo) => <Link className='italic font-semibold underline hover:text-slate-200 bg-slate-800 w-full rounded p-1 ' key={echo.id} href={`/echo/${echo.title}`} onClick={closeNav}>{echo.title}</Link>)}
        </div>
        <div></div>
      </div>)}
    </nav>
  )
}