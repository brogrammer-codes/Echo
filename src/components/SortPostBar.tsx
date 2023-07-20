import React from 'react'
import { SortOrderVal } from '~/utils/enums';

type SortPostBarProps = {
  order: SortOrderVal;
  setOrder: (order: SortOrderVal) => void
}

export const SortPostBar = ({order, setOrder}: SortPostBarProps) => {

  return (
    <div className="flex flex-row space-x-2">

      <button onClick={() => { setOrder(SortOrderVal.LIKES_DESC) }} className={`bg-slate-500 rounded p-2 text-lg font-semibold ${order === SortOrderVal.LIKES_DESC ? 'bg-slate-700' : ''}`}>Least Liked First</button>
      <button onClick={() => {  setOrder(SortOrderVal.LIKES_ASC) }} className={`bg-slate-500 rounded p-2 text-lg font-semibold ${order === SortOrderVal.LIKES_ASC ? 'bg-slate-700' : ''}`}>Most Liked First</button>
      <button onClick={() => { setOrder(SortOrderVal.CREATED_DESC)}} className={`bg-slate-500 rounded p-2 text-lg font-semibold ${order === SortOrderVal.CREATED_DESC ? 'bg-slate-700' : ''}`}>Oldest First</button>
      <button onClick={() => { setOrder(SortOrderVal.CREATED_ASC) }} className={`bg-slate-500 rounded p-2 text-lg font-semibold ${order === SortOrderVal.CREATED_ASC ? 'bg-slate-700' : ''}`}>Newest First</button>
    </div>
  )
}
