import toast from "react-hot-toast";
import { typeToFlattenedError } from "zod";
export const showZodError = (e: typeToFlattenedError<any, string>) => {
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