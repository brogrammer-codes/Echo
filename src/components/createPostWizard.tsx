import { useUser } from "@clerk/nextjs";
import { useRef, useState, useEffect } from "react";
import { Button, Input, RichText } from "~/components/atoms";
import { api, type RouterOutputs } from "~/utils/api";
import { usePost } from "~/hooks";
import { LoadingPage } from "./loading";
import { useRouter } from "next/router";
import { SubEchoSearch } from "./molecules";
import { useForm, SubmitHandler } from "react-hook-form";

interface CreatePostWizardProps {
  currentEchoName?: string;
  postUrl?: string;
}
type CreatePostInputs = {
  title: string;
  url: string;
  echo: string,
  tags: string,
};
const style = {
  input:
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
};
type UrlMetadata = RouterOutputs["posts"]["getMetadataFromUrl"];
export const CreatePostWizard = (props: CreatePostWizardProps) => {
  const router = useRouter();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostInputs>();
  const { user } = useUser();
  const postUrl = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
  const [postEcho, setPostEcho] = useState<string>(props.currentEchoName || "");
  const [showPreview, setShowPreview] = useState(false);

  const routeToPost = (echoName: string, id: string) => {
    router.push(`/echo/${echoName}/comments/${id}`).catch(() => null);
  };
  const { createPost, createPostLoading } = usePost({
    onCreatePostSuccess: (echoName, id) => routeToPost(echoName, id),
  });

  const { mutate: getUrlMetadata } = api.posts.getMetadataFromUrl.useMutation({
    onSuccess: (metadata: UrlMetadata) => {
      if (metadata) {
        const title = getValues("title");
        if (title === "" && metadata.title) {
          setValue("title", metadata.title);
        }
        if (description === "" && metadata.description) {
          setDescription(metadata.description);
        }
      }
    },
  });

  useEffect(() => {
    if (props.currentEchoName) setPostEcho(props.currentEchoName);
  }, []);

  useEffect(() => {
    if (props.postUrl && postUrl.current) {
      postUrl.current.value = props.postUrl;
      getUrlMetadataOnBlur();
    }
  }, [props]);

  if (!user) return <LoadingPage />;

  const getUrlMetadataOnBlur = () => {
    const url = getValues("url");
    if (url) {
      getUrlMetadata({ url });
    }
  };

  const togglePreview = () => {
    setShowPreview((prev) => !prev);
  };

  const submitForm = (data: CreatePostInputs) => {
    if(postEcho) {

      createPost({
        title: data.title, 
        url: data.url, 
        echo: postEcho,
        description,
      })
    }
    // if (postTitle.current && postUrl.current) {
    //   createPost({
    //     title: postTitle.current.value,
    //     url: postUrl.current.value,
    //     echo: postEcho,
    //     description,
    //   });
    // }
  };
  return (
    <div className="m-2 flex w-full gap-3 p-1">
      <div className="w-full">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(submitForm)(event);
          }}
        >
          <div className="flex w-full flex-col space-y-3">
            <label>Post title {errors.title && <span className="text-red-800 font-bold text-lg">Enter a title</span>}</label>
            <input
              className={style.input}
              placeholder="Check out this neat post about..."
              aria-invalid={errors.title ? "true" : "false"}
              {...register("title", { required: true })}
            />
            <label>URL you are sharing a link</label>
            <input
              className={style.input}
              placeholder="www.examp.le"
              {...register("url")}
              onBlur={getUrlMetadataOnBlur}
            />
            <div className="flex h-auto w-full flex-col">
              <button onClick={togglePreview}>Show Preview</button>
              <RichText
                value={description}
                setValue={setDescription}
                edit
                preview={showPreview}
              />
            </div>
            {postEcho ? (
              <div className="flex justify-between p-2">
                {" "}
                {`Echo Space: ${postEcho}`}{" "}
                <button
                  onClick={() => setPostEcho("")}
                  className="mb-1.5 mr-1.5 rounded-lg bg-red-700 px-4 py-1.5 text-lg font-bold text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  Clear
                </button>
              </div>
            ) : (
              <SubEchoSearch selectEcho={(name) => setPostEcho(name)} />
            )}

            <Button
              buttonText={
                createPostLoading ? "Submitting Post..." : "Submit Post"
              }
              type="submit"
              disabled={createPostLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
