import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import React from 'react'


export const Header = () => {
    const {isSignedIn, user} = useUser()
    console.log(user);
    
  return (
    <nav>{user  ? `Welcome, ${user.username}` : `Welcome to Echo`}{isSignedIn ? <SignOutButton /> : <SignInButton />}</nav>
  )
}