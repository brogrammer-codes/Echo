import { api } from "~/utils/api";


export const useGetAllPosts = (orderKey: string) => {
	const { data, isLoading, error } = api.posts.getAll.useQuery({ sortKey: orderKey})
	return { posts: data, postsLoading: isLoading, allPostsError: error }
}