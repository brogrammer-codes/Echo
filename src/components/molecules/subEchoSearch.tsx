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
    <div>
      <Input inputRef={searchRef} onBlur={() => searchRef.current && searchRef.current.value.length &&  setSearchParam(searchRef.current.value)} onKeyDown={onSearchChange} placeholder="Start typing and hit enter or click away to search for sub echos"/>
      {/* <input ref={searchRef} onBlur={() => searchRef.current && setSearchParam(searchRef.current.value)}/> */}
      <div className='flex flex-row space-x-2 p-2'>

        {
          !isLoading && data ? data.map((sub) => <button className='px-2 rounded bg-slate-600' onClick={() => selectEcho(sub.title)}>{sub.title}</button>) : null
        }
      </div>
    </div>
  )
}