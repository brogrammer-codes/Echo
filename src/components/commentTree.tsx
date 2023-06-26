import { LoadingPage } from "~/components/loading";
import { Post } from "~/components/Post";
import { api, RouterOutputs } from "~/utils/api";
import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import Link from "next/link";
import { Button, Textarea } from "~/components/atoms";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { EchoButton } from "~/components/molecules";
import { usePost } from "~/hooks";
import { CreateCommentWizard } from "./createCommentWizard";
dayjs.extend(relativeTime);

type PostComments = RouterOutputs['posts']['getPostById'][number]['comments']
interface DisplayCommentTreeProps {
  comments: PostComments,
  parentId: string | null,
  indent: number,
  submitPostComment: (comment: string, parentId?: string | undefined) => void,
}
interface CommentLeafProps extends DisplayCommentTreeProps {
  comment: PostComments[0]
}
const CommentLeaf = (props: CommentLeafProps) => {
  const { comments, parentId, indent, submitPostComment, comment } = props
  const { id, content, author, createdAt } = comment;
  const { user } = useUser()
  const childComments = comments.filter((comment) => comment.parentCommentId === id)
  const [showReplyWizard, setShowReplyWizard] = useState<boolean>(false)
  const [showCommentTree, setShowCommentTree] = useState<boolean>(false)
  const toggleReply = () => setShowReplyWizard((current) => !current)
  const toggleCommentTree = () => setShowCommentTree((current) => !current)
  const createComment = (comment: string) => {
    submitPostComment(comment, id)
    toggleReply()
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
              <div>
                <span onClick={toggleReply}>Reply</span>
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
      {showCommentTree && <DisplayCommentTree comments={comments} parentId={id} indent={indent + 1} submitPostComment={submitPostComment} />}
    </li>
  );
}
export const DisplayCommentTree = (props: DisplayCommentTreeProps) => {
  const { comments, parentId, indent, submitPostComment } = props
  const parentComments = comments.filter((comment) => comment.parentCommentId === parentId);
  const { user } = useUser()
  return (
    <ul className={`ml-${indent * 3} p-1`}>
      {parentComments.map((comment) => <CommentLeaf key={`comment-${comment.id}-parent-${parentId || ''}`} comment={comment} {...props} />)}
    </ul>
  );
}