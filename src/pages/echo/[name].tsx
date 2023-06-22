import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";


export default function Home() {
  const {data, isLoading} = api.subEcho.getSubEchoByName.useQuery({name: 'Learning'})
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  return (
    <div className="flex flex-col">
      {data.title}
    </div>
  );
}
