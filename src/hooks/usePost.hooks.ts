

import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { showZodError } from "./helpers";

interface usePostProps {
  postId?: string,
  onCommentSuccess?: () => void
  onCreatePostSuccess?: () => void
}

export const usePost = ({ onCommentSuccess, postId, onCreatePostSuccess }: usePostProps) => {
  const ctx = api.useContext()
  let post = null
  let postLoading = false
  if(postId) {
    const { data, isLoading } = api.posts.getPostById.useQuery({ id: postId })
    post = data && data.length && data[0] 
    postLoading = isLoading
  }

  const { mutate: likePostMutate, isLoading: likeLoading } = api.posts.likePost.useMutation({
    onSuccess: () => {
      // TODO: Move to correct onSuccess callbacks
      // void ctx.posts.getAll.invalidate();
      // void ctx.posts.getPostById.invalidate()
      // void ctx.posts.getPostsByEchoId.invalidate()
      toast.success("Post updated!")
    },
    onError: (e) => {
      if (e.message) toast.error(e.message)
      const errorMessage = e.data?.zodError
      if (errorMessage) showZodError(errorMessage)
    }
  })
  const { mutate: addCommentMutate, isLoading: commentLoading } = api.posts.addComment.useMutation({
    onSuccess: () => {
      void ctx.posts.getPostById.invalidate()
      onCommentSuccess && onCommentSuccess()
    },
    onError: () => {
      toast.error("Could not post comment")
    }
  })

  const { mutate: createPost, isLoading: createPostLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getPostsByEchoId.invalidate()
      void ctx.posts.getAll.invalidate();
      onCreatePostSuccess && onCreatePostSuccess()
      // setShowInputForm(false)
    },
    onError: (e) => {
      if (e.message) toast.error(e.message)
      const errorMessage = e.data?.zodError
      if (errorMessage) showZodError(errorMessage)
    }
  })

  const {mutate: deletePost} = api.posts.deletePost.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
      void ctx.posts.getPostById.invalidate()
      void ctx.posts.getPostsByEchoId.invalidate()
    },
    onError: (e) => {
      if (e.message) toast.error(e.message)
      const errorMessage = e.data?.zodError
      if (errorMessage) showZodError(errorMessage)
    }
  })
  
  return {
    post, 
    postLoading,
    likePost: likePostMutate,
    likeLoading,
    addComment: addCommentMutate,
    commentLoading,
    createPost,
    createPostLoading,
    deletePost,
  }
}