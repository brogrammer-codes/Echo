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
import EchoButton from "~/components/atoms/echoButton";
import { usePost } from "~/hooks";
import { CreateCommentWizard } from "./createCommentWizard";
dayjs.extend(relativeTime);

type PostComments = RouterOutputs['posts']['getPostsById'][number]['comments']
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
  const [showReplyWizard, setShowReplyWizard] = useState<boolean>(false)
  const toggleReply = () => setShowReplyWizard((current) => !current)

  const createComment = (comment: string) => {
    submitPostComment(comment, id)
    toggleReply()
  }

  return (
    <li className="m-1">
      <div className="bg-slate-950 p-2 rounded">
        <div className="text-sm">
          <span className="font-bold">

            {author.username}
          </span>
          <span className="font-thin">{` · ${dayjs(createdAt).fromNow()}`}</span></div>
        <p className="font-normal text-lg">{content}</p>
        <div className="text-xs font-bold">
          {user && (
            <div>
              <span onClick={toggleReply}>Reply</span>
              {
                showReplyWizard && <CreateCommentWizard submitComment={createComment} commentLoading={false} />
              }
            </div>
          )}
        </div>
      </div>
      <DisplayCommentTree comments={comments} parentId={id} indent={indent + 1} submitPostComment={submitPostComment} />
    </li>
  );
}
export const DisplayCommentTree = (props: DisplayCommentTreeProps) => {
  const { comments, parentId, indent, submitPostComment } = props
  const parentComments = comments.filter((comment) => comment.parentCommentId === parentId);
  const { user } = useUser()
  return (
    <ul className={`ml-${indent * 3} p-1`}>
      {parentComments.map((comment) => <CommentLeaf key={`comment-${comment.id}-parent-${parentId || ''}`} comment={comment} {...props}/>)}
    </ul>
  );
}