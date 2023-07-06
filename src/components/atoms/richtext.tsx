import React from 'react'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { LoadingSpinner } from '../loading';
import RichTextDisplay from './richTextDisplay';


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})
interface RichTextProps {
  value: string;
  setValue?: (newVal: string) => void;
  edit?: boolean;
  preview?: boolean;
}
const style = {
  input: "h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-transparent disabled:border-none disabled:resize-none disabled:text-slate-50"
}

export const RichText: React.FC<RichTextProps> = ({ value, setValue, edit, preview }) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]
  //   console.log(value);

  return (
    <div className='flex w-full flex-col'>
      {setValue && (
        <div className="py-3 m-1 block h-auto">

          <QuillNoSSRWrapper
            theme="snow"
            onChange={(event) => setValue(event)}
            value={value}
            modules={modules}
            formats={formats}
            onBlur={(_, __, editor) => setValue(editor.getHTML())}
            readOnly={!edit} />
        </div>
      )}
      {preview && <RichTextDisplay value={value} />}
    </div>
  )

}