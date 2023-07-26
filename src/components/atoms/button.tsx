import React from 'react'

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    buttonText: string;
}
const style = {
  normal: 'btn rounded-md bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600'
}
export const Button = (props: ButtonProps) => {
  return (<button type="button" className={style.normal} {...props}>{props.buttonText}</button>)
}