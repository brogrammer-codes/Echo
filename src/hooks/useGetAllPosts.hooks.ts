import { api } from "~/utils/api";


export const useGetAllPosts = (orderVal: string, orderKey: string) => {
	const { data, isLoading, error } = api.posts.getAll.useQuery({ sortValue: orderVal, sortKey: orderKey})
	return { posts: data, postsLoading: isLoading, allPostsError: error }
}