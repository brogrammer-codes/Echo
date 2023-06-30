
import { RouterOutputs } from "~/utils/api";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import { CreateCommentWizard } from "./createCommentWizard";
dayjs.extend(relativeTime);

type PostComments = RouterOutputs['posts']['getPostById'][number]['comments']
interface DisplayCommentTreeProps {
  comments: PostComments,
  parentId: string | null,
  indent: number,
  submitPostComment: (comment: string, parentId?: string | undefined) => void,
  deleteComment: (commentId: string) => void
}
interface CommentLeafProps extends DisplayCommentTreeProps {
  comment: PostComments[0]
}
const CommentLeaf = (props: CommentLeafProps) => {
  const { comments, parentId, indent, submitPostComment, comment, deleteComment } = props
  const { id, content, author, createdAt } = comment;
  const { user } = useUser()
  const childComments = comments.filter((comment) => comment.parentCommentId === id)
  const [showReplyWizard, setShowReplyWizard] = useState<boolean>(false)
  const [showCommentTree, setShowCommentTree] = useState<boolean>(true)
  const toggleReply = () => setShowReplyWizard((current) => !current)
  const toggleCommentTree = () => setShowCommentTree((current) => !current)
  const createComment = (comment: string) => {
    submitPostComment(comment, id)
    toggleReply()
  }
  const DeleteButton = () => {
    const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false)
    if (!user || user.id !== comment.authorId) return null
    const toggleDeleteOption = () => {
      setShowDeleteOption((option) => !option)
    }
    const deletePostOnClick = () => {
      deleteComment(comment.id)
    }
    if (showDeleteOption) {
      return (
        <div className="flex flex-row space-x-2">
          <span className="text-slate-500 italic font-semibold">Are you sure?</span>
          <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={deletePostOnClick}>Yes</button>
          <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={toggleDeleteOption}>Cancel</button>
        </div>
      )
    }
    return (
      <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={toggleDeleteOption}>Delete</button>
    )
  }
  return (
    <li className="m-1">
      <div className="flex flex-row bg-slate-950 p-2 rounded">
        <div className="flex flex-col basis-11/12">
          <div className="text-sm">
            <span className="font-bold">

              {author.username}
            </span>
            <span className="font-thin">{` · ${dayjs(createdAt).fromNow()}`}</span>
          </div>
          <p className="font-normal text-lg">{content}</p>
          <div className="text-xs font-bold">
            {user && (
              <div className="flex space-x-2">
                <button className="text-slate-500 italic font-semibold underline hover:cursor-pointer" onClick={toggleReply}>Reply</button>
                <DeleteButton />
              </div>
            )}
            <span>{`${childComments.length} comments`}</span>
          </div>
            {
              showReplyWizard && <CreateCommentWizard submitComment={createComment} commentLoading={false} />
            }
        </div>
        {childComments.length ? <button onClick={toggleCommentTree}>{showCommentTree ? "[-]" : "[+]"}</button> : null}
      </div>
      {showCommentTree && <DisplayCommentTree comments={comments} parentId={id} indent={indent + 1} submitPostComment={submitPostComment} deleteComment={deleteComment}/>}
    </li>
  );
}
export const DisplayCommentTree = (props: DisplayCommentTreeProps) => {
  const { comments, parentId, indent } = props
  const parentComments = comments.filter((comment) => comment.parentCommentId === parentId);
  const { user } = useUser()
  return (
    <ul className={`ml-${indent * 3} p-1`}>
      {parentComments.map((comment) => <CommentLeaf key={`comment-${comment.id}-parent-${parentId || ''}`} comment={comment} {...props} />)}
    </ul>
  );
}