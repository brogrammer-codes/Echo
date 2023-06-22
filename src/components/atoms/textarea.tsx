import React from 'react'

// type InputProps  = {
  
// }
interface InputProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  inputRef: React.RefObject<HTMLTextAreaElement> | React.LegacyRef<HTMLTextAreaElement>;
}
const style = {
  input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
}

export const Textarea: React.FC<InputProps> = (props) => {
  return (
    <textarea 
      ref={props.inputRef}
      className={style.input}
      {...props}
    />
  )
}