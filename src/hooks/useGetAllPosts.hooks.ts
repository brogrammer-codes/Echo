import { useEffect } from "react";
import { api } from "~/utils/api";


export const useGetAllPosts = (orderVal: string, orderKey: string) => {
	const { data, isLoading, error } = api.posts.getAll.useQuery({ sortValue: orderVal, sortKey: orderKey})
  console.log("hook invoked", orderVal);
  
	// useEffect(() => {
	// 	refetch({throwOnError: true})
	// 	console.log("refetching", orderVal);
	// }, [orderVal])


	return { posts: data, postsLoading: isLoading, allPostsError: error }
}