import React from 'react'

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    buttonText: string;
}

export const Button = (props: ButtonProps) => {
  return (<button type="button" className="text-white bg-[#4D6890] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2" {...props}>{props.buttonText}</button>)
}