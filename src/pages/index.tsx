import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, Textarea } from "~/components/atoms";
import toast from "react-hot-toast";
import { typeToFlattenedError } from "zod";
import { CreatePostWizard } from "~/components/createPostWizard";


export default function Home() {
  const { data, isLoading } = api.posts.getAll.useQuery()
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  return (
    <div className="flex flex-col">
      <CreatePostWizard />
      {
        data.map((post) => <Post key={post.id} {...post} />)
      }
    </div>
  );
}
