import React from 'react'

type TagProps = {
    text: string,
    onClick?: () => void
}

export const Tag = ({text}: TagProps) => {
  return (
    <div className='flex py-0.5 px-2.5 bg-slate-300 text-slate-900 rounded-full font-semibold'>{text}</div>
  )
}