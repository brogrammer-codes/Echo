import {
  SignInButton,
  SignOutButton,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

export const Header = () => {
  const { isSignedIn, user } = useUser();
  const { data: subEchos } = api.subEcho.getHeaderEcho.useQuery();
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => {
    setNavOpen((curNav) => !curNav);
  };
  const closeNav = () => {
    setNavOpen(false);
  };
  useEffect(() => {
    window.addEventListener("click", (e: Event) => {
      const navBar = document.getElementById("navBar");
      if (navBar && !navBar.contains(e.target as Node) && navOpen) {
        closeNav();
      }
    });
  });
  return (
    <nav className="border-grey-200 bg-slate-600" id="navBar">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          className="flex text-lg font-bold md:text-3xl"
          href={"/"}
          onClick={closeNav}
        >
          Welcome to Echo{" "}
          <span className="block md:hidden">
            {user && user.username && `, ${user.username}`}
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={toggleNav}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <div className="flex flex-row space-x-4">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 45,
                      height: 45,
                      marginLeft: 2,
                    },
                    userButtonOuterIdentifier:
                      "text-lg text-slate-50 font-bold",
                  },
                }}
                afterSignOutUrl="/"
                showName
              />
            ) : (
              <SignInButton mode="modal">
                <button className="btn rounded-md bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
      <div className="hidden flex-row space-x-5 px-3 py-1 text-lg md:flex">
        {subEchos?.map((echo) => (
          <Link
            className="font-semibold italic underline hover:text-slate-200"
            key={echo.id}
            href={`/echo/${echo.title}`}
          >
            {echo.title}
          </Link>
        ))}
        <Link
          href={"/echo"}
          className="font-semibold italic underline hover:text-slate-200"
        >
          ...more
        </Link>
      </div>
      {navOpen && (
        <div className="flex h-screen justify-between space-x-2 pb-10">
          <div className="flex flex-col px-1">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 45,
                      height: 45,
                      marginLeft: 2,
                    },
                    userButtonOuterIdentifier:
                      "text-lg text-slate-50 font-bold",
                  },
                }}
                afterSignOutUrl="/"
                showName
              />
            ) : (
              <SignInButton />
            )}
          </div>
          <div className="flex flex-col space-y-5 px-3 py-1 text-lg">
            <span>Echo List</span>
            {subEchos?.map((echo) => (
              <Link
                className="w-full rounded bg-slate-800 p-1 font-semibold italic underline hover:text-slate-200 "
                key={echo.id}
                href={`/echo/${echo.title}`}
                onClick={closeNav}
              >
                {echo.title}
              </Link>
            ))}
            <Link
              href={"/echo"}
              className="w-full rounded bg-slate-800 p-1 font-semibold italic underline hover:text-slate-200 "
              onClick={closeNav}
            >
              ...more
            </Link>
          </div>
          <div></div>
        </div>
      )}
    </nav>
  );
};
