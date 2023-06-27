

import { api, RouterOutputs } from "~/utils/api";
import toast from "react-hot-toast";
import { typeToFlattenedError } from "zod";

interface usePostProps {
  postId?: string,
  onCommentSuccess?: () => void
  onCreatePostSuccess?: () => void
}
const showZodError = (e: typeToFlattenedError<any, string>) => {
  const errorMessage = e.fieldErrors
  const title = errorMessage?.title
  const echo = errorMessage?.echo
  const description = errorMessage?.description
  const url = errorMessage?.url
  if (url && url[0]) {
    toast.error(url[0])
  } if(title && title[0]) {
    toast.error(title[0])
    
  } if(echo && echo[0]) {
    toast.error(echo[0])
    
  } if(description && description[0]) {
    toast.error(description[0])
  } 
  else {
    toast.error("Failed to post")
  }
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
      void ctx.posts.getAll.invalidate();
      void ctx.posts.getPostById.invalidate()
      void ctx.posts.getPostsByEchoId.invalidate()
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