

import { api, RouterOutputs } from "~/utils/api";
import toast from "react-hot-toast";

interface usePostProps {
  postId?: string,
  onCommentSuccess?: () => void
}

export const usePost = ({ onCommentSuccess, postId }: usePostProps) => {
  const ctx = api.useContext()
  let post = null
  let postLoading = false
  if(postId) {
    const { data, isLoading } = api.posts.getPostsById.useQuery({ id: postId })
    post = data && data.length && data[0] 
    postLoading = isLoading
  }

  const { mutate: likePostMutate, isLoading: likeLoading } = api.posts.likePost.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
      void ctx.posts.getPostsById.invalidate()
      void ctx.posts.getPostsByEchoId.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post")
      }
    }
  })
  const { mutate: addCommentMutate, isLoading: commentLoading } = api.posts.addComment.useMutation({
    onSuccess: () => {
      void ctx.posts.getPostsById.invalidate()
      onCommentSuccess && onCommentSuccess()
    },
    onError: () => {
      toast.error("Could not post comment")
    }
  })

  return {
    post, 
    postLoading,
    likePost: likePostMutate,
    likeLoading,
    addComment: addCommentMutate,
    commentLoading
  }
}