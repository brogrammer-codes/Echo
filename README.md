# Echo

Echo is an open-source web application that allows users to sign up, create spaces, share posts, and interact with content through liking and disliking posts. It provides a Reddit-like experience with a focus on simplicity and community engagement.

## Features

- User sign-up and authentication system
- Space creation for different topic discussions
- Post creation and sharing within spaces
- Like and dislike functionality for posts
- Commenting on posts
- User profiles with activity history (WORKING ON THIS)

## Technologies Used
This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [PlanetScale DB](https://app.planetscale.com/)
- [Clerk Auth](https://clerk.com)
### Learn More
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials


## Getting Started
- Fork or Clone [this repo](https://github.com/brogrammer-codes/Echo)
- `npm install` or `yarn install` to install `node_modules` and get it up and running
- Sign up for PlanetScale, Clerk, and Upstash (Services used for DB, user Auth, and Rate Limiting)
- Fill in fields in the `.env` file. 
- `npm run dev` or `yarn run dev` to start the project up. 
- Access the application in your browser at `http://localhost:3000`.
### Prerequisites

- Node.js and npm installed on your machine


## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Contributing

Contributions to Echo are welcome! If you have any bug fixes, improvements, or new features to propose, please submit a pull request. Be sure to follow the project's code style and guidelines.

## Change Log
- **[Version 1.0.0](https://github.com/brogrammer-codes/Echo/releases/tag/v1.0.0)** (2023-10-07)
     - User can sign up via GitHub or create a new account using an email. 
     - User can create Echo Spaces and Edit Echo Spaces they have created. 
     - User can Create posts in their own echo spaces and create posts in other echo spaces
     - Users can Like posts
- **[Version 1.0.1](https://github.com/brogrammer-codes/Echo/releases/tag/v1.0.1)** (2023-11-07)
     - Added Rate Limiting
     - CI build in GitHub, removed TypeChecks from Vercel
     - Non Logged in users cannot access new post button
     - Fixed imports
- (2023-26-07)
  - Added React Hook Form to create post wizard, still need to fully integrate it. 
  - Added Tags to a post and to the create post wizard
    - Updated router to map over tags when creating a post
    - Added tags to the response 
  - Added Tag Atom to display tags in a post
    - TODO: Need to add remove tag logic 
  - Updated sort bar to a dropdown select.
    - TODO: Move options to an array to map over inside select
  - Updated sign in button
  - Updated create post button