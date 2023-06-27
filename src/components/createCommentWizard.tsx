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
dayjs.extend(relativeTime);

interface CreateCommentWizardProps {
    submitComment: (content: string) => void;
    commentLoading: boolean;
}
export const CreateCommentWizard = ({ submitComment, commentLoading }: CreateCommentWizardProps) => {
    const { user } = useUser()
    const commentRef = useRef<HTMLTextAreaElement>(null)
    if (!user) return null
    const createComment = () => {
        if (commentRef.current) {
            submitComment(commentRef.current.value)
            commentRef.current.value = ''
        }
    }
    return (
        <div className="flex flex-row space-x-2 py-3 px-1">
            <Textarea inputRef={commentRef} />
            <div className="h-fit">
                <Button buttonText="Submit Comment" onClick={createComment} disabled={commentLoading} />
            </div>
        </div>
    )
}