import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import { CreatePostWizard } from "~/components/createPostWizard";
import { useRouter } from 'next/router';
import { clerkClient } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import { useGetAllPosts } from "~/hooks";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";



type PostWithUser = RouterOutputs["subEcho"]["getAll"][number]

export default function New() {
    const router = useRouter()
    const { echoName, postUrl } = router.query;
  return (
    <div className="flex flex-row w-full">
          <CreatePostWizard currentEchoName={echoName?.toString()} postUrl={postUrl?.toString()}/>

    </div>
  );
}

  