import Link from "next/link";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";



export default function Home() {
  const hello = api.example.hello.useQuery({ text: "Echo" });

  return (
    <div className="flex flex-col">
      {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      <Post />
    </div>
  );
}
