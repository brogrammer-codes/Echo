import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import React from 'react'


export const Header = () => {
    const {isSignedIn, user} = useUser()
    
  return (
    <nav>{user && user.username ? `Welcome, ${user.username}` : `Welcome to Echo`}{isSignedIn ? <SignOutButton /> : <SignInButton />}</nav>
  )
}