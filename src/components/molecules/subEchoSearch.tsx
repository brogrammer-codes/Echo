import React, { useRef, useState } from 'react'
import { api } from "~/utils/api";
import { Input } from '../atoms';
type Props = {
  selectEcho: (echoName: string) => void
}

export const SubEchoSearch = ({selectEcho}: Props) => {
  const [searchParam, setSearchParam] = useState('')
  const { data, isLoading } = api.subEcho.searchSubEchoByName.useQuery({ name: searchParam })
  const searchRef = useRef<HTMLInputElement>(null)
  const onSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchRef.current && searchRef.current.value.length) {
        setSearchParam(searchRef.current.value)
      }
    }
  }
  return (
    <div className='w-full flex flex-col'>
      <Input inputRef={searchRef} onBlur={() => searchRef.current &&  setSearchParam(searchRef.current.value)} onKeyDown={onSearchChange} placeholder="Start typing and hit enter or click away to search for sub echos"/>
      <div className='flex flex-row space-x-2 p-2 overflow-auto'>
        {
          !isLoading && data ? data.map((sub) => <button key={`echo-${sub.title}`} className='px-2 rounded bg-slate-600' onClick={() => selectEcho(sub.title)}>{sub.title}</button>) : null
        }
      </div>
    </div>
  )
}