import React from 'react'

// type InputProps  = {
  
// }
interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputRef: React.RefObject<HTMLInputElement>;
}
const style = {
  input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      ref={props.inputRef}
      type="text"
      id="username"
      className={style.input}
      {...props}
    />
  )
}