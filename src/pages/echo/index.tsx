import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api } from "~/utils/api";


export default function Home() {
  const {data, isLoading} = api.subEcho.getAll.useQuery()
  console.log(isLoading, data);
  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load Echos</div>
  return (
    <div className="flex flex-col">
      {
        data.map((echo) => <span>e/{echo.title}</span>)
      }
    </div>
  );
}
