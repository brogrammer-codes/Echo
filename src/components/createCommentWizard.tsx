import { Button, Textarea } from "~/components/atoms";
import { useRef} from "react";
import { useUser } from "@clerk/nextjs";

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